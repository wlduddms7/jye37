sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/syncStyleClass"
],
function (Controller, MessageToast, Filter, FilterOperator,  Fragment, JSONModel,syncStyleClass ) {
    "use strict";

    return Controller.extend("cl3.syncyoung.mm.list.stock.controller.stockView", {
        onInit: function () {
            var oModel_json = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZC302MMCDS0005_CDS/");
            var oModel_json_header = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZC302MMCDS0003_CDS/");
            var self = this;
            oModel_json.read("/StockItemSet", {
                success: function(oData) {
                    console.log("데이터 읽기 성공:", oData);

                },
                error: function(oError) {
                    console.error("오류 발생:", oError);
                }
            }); 
            this.getView().setModel(oModel_json, "stock");
            
            //header
            oModel_json_header.read("/StockSet", {
                filters: [new sap.ui.model.Filter("scode", FilterOperator.EQ, "ST03")],
                success: function(oData) {
                    console.log("데이터 읽기 성공:", oData);

                    var oJSONModel = new sap.ui.model.json.JSONModel(oData.results);
                    self.getView().byId("MatcodeComboBox").setModel(oJSONModel, "filteredStock");
                },
                error: function(oError) {
                    console.error("오류 발생:", oError);
                }
            }); 

        },
        onSearch : function() {
            let oTable = this.getView().byId("docList"),
                oBinding = oTable.getBinding("rows"),
                aFilter = [],
                oFilter = null;

            var vMatnr = this.getView().byId("MatcodeComboBox").getValue();
  
            if(vMatnr != ''){

                oFilter = new Filter({
                    path : "matnr",
                    operator : FilterOperator.Contains, //like같은거임
                    value1 : vMatnr
                });

                aFilter.push(oFilter);
                oFilter = null;
            };
            oBinding.filter(aFilter);
        },
        onOpenDialog : function(oEvent){
            var oButton = oEvent.getSource();
            var oContext = oButton.getParent().getBindingContext();
            var vMatnr =  oContext.getProperty('matnr');
            var vScode =  oContext.getProperty('scode');

            let oDialog = new sap.m.Dialog(
                {
                    title : "재고관리 ITEM LIST",
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
                        label: new sap.m.Label({ text: "자재코드" }),
                        template: new sap.m.Text({ text: "{stock>matnr}" }),
                        width : '7rem',
                        hAlign : 'Center'
                    }),
                    new sap.ui.table.Column({
                        label: new sap.m.Label({ text: "창고코드" }),
                        template: new sap.m.Text({ text: "{stock>scode}" }),
                        width : '5rem',
                        hAlign : 'Center'
                    }),
                    new sap.ui.table.Column({
                        label: new sap.m.Label({ text: "생성일" }),
                        template: new sap.m.Text({ text: {
                                    path: 'stock>bdatu_string',
                                    type: 'sap.ui.model.type.Date',
                                    formatOptions: {
                                        style: 'long',
                                        source: {
                                        pattern: 'yyyy/MM/dd'
                                            }
                                        }
                                    } }),
                        width : '10rem',
                        hAlign : 'Center'
                    }),
                    new sap.ui.table.Column({
                        label: new sap.m.Label({ text: "창고명" }),
                        template: new sap.m.Text({ text: "{stock>sname}" }),
                        width : '5rem',
                        hAlign : 'Center'
                    }),
                    new sap.ui.table.Column({
                        label: new sap.m.Label({ text: "자재명" }),
                        template: new sap.m.Text({ text: "{stock>maktx}" })
                    }),
                    new sap.ui.table.Column({
                        label: new sap.m.Label({ text: "자재유형" }),
                        template: new sap.m.Text({ text: "{stock>mtart}" }),
                        width : '7rem',
                        hAlign : 'Center'
                    }),
                    new sap.ui.table.Column({
                        label: new sap.m.Label({ text: "수량" }),
                        template: new sap.m.Text({ text: "{stock>i_rtptqua}" }),
                        width : '7rem',
                        hAlign : 'Center'
                    }),
                    new sap.ui.table.Column({
                        label: new sap.m.Label({ text: "단위" }),
                        template: new sap.m.Text({ text: "{stock>meins}" }),
                        width : '7rem',
                        hAlign : 'Center'
                    })
                ]
            });
            
            // d. EntitySet 설정 (filter 포함)
            oTable.bindRows({
                path: "stock>/StockItemSet",
                filters: [new Filter("matnr", FilterOperator.EQ, vMatnr ),
                          new Filter("scode", FilterOperator.EQ, vScode )
                ] // 필터 적용
            });

            
            // e. 설정된 테이블을 팝업창에 넣고 View에 보내고 팝업창을 띄운다.
            oDialog.addContent(oTable);
            this.getView().addDependent(oDialog);
            oDialog.open();

            // var oButton = oEvent.getSource();
            // var oContext = oButton.getParent().getBindingContext();   // 해당 코드를 통하여 ITEM의 필터조건 값을 가져옴

            // var vMatnr =  oContext.getProperty('matnr');
            // var vScode =  oContext.getProperty('scode');

            // // 팝업창
            // if(!this.pDialog){
            //     this.pDialog = this.loadFragment({
            //         name : "cl3.syncyoung.mm.list.stock.view.ItemDialog"
            //     });
            // }
            // this.pDialog.then(function(oDialog){
            //     var oTable = oDialog.getContent()[0].getContent()[0];  // 다이얼로그 첫 번째 자식이 테이블이어야 함
            //     if (oTable && oTable.isA("sap.ui.table.Table")) {
            //         var oBinding = oTable.getBinding("rows");
            //         // 필터 설정
            //         var aFilter = [ new Filter("matnr", FilterOperator.EQ, vMatnr ),
            //                         new Filter("scode", FilterOperator.EQ, vScode )
            //         ]
            //         oBinding.filter(aFilter);
            //     }

            //     oDialog.open();
            // });
        },
        onCloseDialog: function(){
            this.byId("itemDialog").close();
        },
        onReset: function() {

            let oTable   = this.getView().byId("docList"),
                oBinding = oTable.getBinding("rows"),    // rows 정보를 가져옴
                aFilter  = [],                           // aFilter = arrayFilter  -> 2. 이 배열에 넣는다.
                oFilter  = null;                         // oFilter = objectFilter -> 1. oFilter를 통해 WA 형태로 검색 조건을 Making해서

            this.byId("MatcodeComboBox").setValue("");

            var vMatnr   = this.getView().byId("MatcodeComboBox").getValue();

            if (vMatnr != '') {

                oFilter = new Filter({
                    path: "Matnr",
                    operator: FilterOperator.EQ,
                    value1: vMatnr
                });

                aFilter.push(oFilter);
                oFilter = null;
                
            };

            oBinding.filter(aFilter); // Making한 검색 조건들을 Entityset에 날려준다.

        },

    });
});
