sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/viz/ui5/format/ChartFormatter',
    'sap/viz/ui5/api/env/Format',
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/BindingMode'
],
function (Controller, Filter, FilterOperator, ChartFormatter, Format, JSONModel, BindingMode) {
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
            console.log(oModel_json);

            ////// popover 
            // Format.numericFormatter(ChartFormatter.getInstance());
            // // set explored app's demo model on this sample
            // var oModel = new JSONModel(this.settingsModel);
            // oModel.setDefaultBindingMode(BindingMode.OneWay);
            // this.getView().setModel(oModel);

            // var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            // oVizFrame.setVizProperties({
            //     title: {
            //         visible: false
            //     }
            // });
            // oVizFrame.setModel(oModel_json, "Doc");

            // var oPopOver = this.getView().byId("idPopOver");
            // oPopOver.connect(oVizFrame.getVizUid());
            // oPopOver.setFormatString(ChartFormatter.DefaultPattern.STANDARDFLOAT);

            // var that = this;
            // dataModel.attachRequestCompleted(function() {
            //     that.dataSort(this.getData());
            // });



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

        }
    });
});
