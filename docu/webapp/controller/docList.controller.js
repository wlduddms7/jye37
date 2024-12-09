sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/viz/ui5/format/ChartFormatter'
],
function (Controller, Filter, FilterOperator, ChartFormatter) {
    "use strict";

    return Controller.extend("cl3.syncyoung.mm.doc.docu.controller.docList", {
        onInit: function () {
            var oModel_json = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZC302MMCDS0007_CDS/");

            oModel_json.read("/DocSet", {
                success: function(oData) {
                    console.log("데이터 읽기 성공:", oData);
                },
                error: function(oError) {
                    console.error("오류 발생:", oError);
                }
            }); 
            this.getView().setModel(oModel_json, "Doc");

            
            var oVizChart = this.getView().byId("idVizFrame");
            var oVizPopOver = this.getView().byId("idPopOver");
            oVizPopOver.connect(oVizChart.getVizUid());
            oVizPopOver.setFormatString(ChartFormatter.DefaultPattern.STANDARDCURRENCY.STANDARDFLOAT);

        },
        onItems: function(oEvent){
            // 종합정보센터로부터 선택한 정보를 얻어옴
            let oData = oEvent.getSource().getBindingContext().getObject(),
            // 이벤트를 적용할 element 를 읽어옴
                oTable = this.getView().byId("item"),
            // entityset 정보 
                oBinding = oTable.getBinding('rows'),
            //object 
                oFilter = null,
            //검색조건을 들고갈 배열
                aFilter = [];
                

            oFilter = new Filter({
                path : "Mblnr",
                operator : FilterOperator.EQ,
                value1 : oData.Mblnr
            });
            aFilter.push(oFilter); //검색조건을 배열에 담아준다
            oBinding.filter(aFilter); //검색조건을 실행

        },
        onOpenDialog : function(oEvent){
            var oButton = oEvent.getSource();
            var oContext = oButton.getParent().getBindingContext();   // 해당 코드를 통하여 ITEM의 필터조건 값을 가져옴

            var vMblnr =  oContext.getProperty('Mblnr');
            
            let oDialog = new sap.m.Dialog(
                {
                    title : "자재문서 ITEM LIST",
                    contentWidth: "auto",
                    contentHeight: "auto",
                    resizable: true,
                    draggable: true,
                    endButton: new sap.m.Button
                    (
                        {
                            text: "X",
                            class : 'btn',
                            press: function () {
                                oDialog.close();
                            }.bind(this)
                        }
                    )
                }
            )

            var oTable = new sap.ui.table.Table({
                columns: [
                    new sap.ui.table.Column({
                        label: new sap.m.Label({ text: "자재문서번호" }),
                        template: new sap.m.Text({ text: "{Mblnr}" }),
                        width : '7rem',
                        hAlign : 'Center'
                    }),
                    new sap.ui.table.Column({
                        label: new sap.m.Label({ text: "자재문서연도" }),
                        template: new sap.m.Text({ text: "{Mjahr}" }),
                        width : '5rem',
                        hAlign : 'Center'
                    }),
                    new sap.ui.table.Column({
                        label: new sap.m.Label({ text: "자재코드" }),
                        template: new sap.m.Text({ text: "{Matnr}" }),
                        width : '5rem',
                        hAlign : 'Center'
                    }),
                    new sap.ui.table.Column({
                        label: new sap.m.Label({ text: "자재명" }),
                        template: new sap.m.Text({ text: "{Maktx}" })
                    }),
                    new sap.ui.table.Column({
                        label: new sap.m.Label({ text: "창고코드" }),
                        template: new sap.m.Text({ text: "{Scode}" }),
                        width : '5rem',
                        hAlign : 'Center'
                    }),
                    new sap.ui.table.Column({
                        label: new sap.m.Label({ text: "이동유형" }),
                        template: new sap.m.Text({ text: "{Movetype}" }),
                        width : '5rem',
                        hAlign : 'Center'
                    }),
                    new sap.ui.table.Column({
                        label: new sap.m.Label({ text: "일자" }),
                        template: new sap.m.Text({ text: "{Budat}" }),
                        width : '7rem',
                        hAlign : 'Center'
                    }),
                    new sap.ui.table.Column({
                        label: new sap.m.Label({ text: "수량" }),
                        template: new sap.m.Text({ text: "{Menge}" }),
                        width : '7rem',
                        hAlign : 'Center'
                    }),
                    new sap.ui.table.Column({
                        label: new sap.m.Label({ text: "단위" }),
                        template: new sap.m.Text({ text: "{Meins}" }),
                        width : '7rem',
                        hAlign : 'Center'
                    }),
                    new sap.ui.table.Column({
                        label: new sap.m.Label({ text: "단가" }),
                        template: new sap.m.Text({ text: {
                                parts:[{path:'Netwr'},{path:'Waers'}],
                                type: 'sap.ui.model.type.Currency',
                                formatOptions: {showMeasure: true }
                                } }),
                        width : '7rem',
                        hAlign : 'Center'
                    }),
                    new sap.ui.table.Column({
                        label: new sap.m.Label({ text: "품질검수번호" }),
                        template: new sap.m.Text({ text: "{Qinum}" }),
                        width : '7rem',
                        hAlign : 'Center'
                    }),
                    new sap.ui.table.Column({
                        label: new sap.m.Label({ text: "거래처코드" }),
                        template: new sap.m.Text({ text: "{Bpcode}" }),
                        width : '7rem',
                        hAlign : 'Center'
                    })
                ]
            });
            
            // d. EntitySet 설정 (filter 포함)
            oTable.bindRows({
                path: "/DocsItemSet",
                filters: [new Filter("Mblnr", FilterOperator.EQ, vMblnr )
                ] // 필터 적용
            });

            
            // e. 설정된 테이블을 팝업창에 넣고 View에 보내고 팝업창을 띄운다.
            oDialog.addContent(oTable);
            this.getView().addDependent(oDialog);
            oDialog.open();

            // // 팝업창
            // if(!this.pDialog){
            //     this.pDialog = this.loadFragment({
            //         name : "cl3.syncyoung.mm.doc.docu.view.ItemDialog"
            //     });
            // }
            // this.pDialog.then(function(oDialog){
            //     var oTable = oDialog.getContent()[0].getContent()[0];  // 다이얼로그 첫 번째 자식이 테이블이어야 함
            //     if (oTable && oTable.isA("sap.ui.table.Table")) {
            //         var oBinding = oTable.getBinding("rows");
            //         // 필터 설정
            //         var aFilter = [ new Filter("Mblnr", FilterOperator.EQ, vMblnr )]
            //         oBinding.filter(aFilter);
            //     }

            //     oDialog.open();
            // });
        },
        onCloseDialog: function(){
            this.byId("itemDialog").close();
        },
    });
});
