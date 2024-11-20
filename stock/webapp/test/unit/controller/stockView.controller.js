/*global QUnit*/

sap.ui.define([
	"cl3syncyoungmmlist/stock/controller/stockView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("stockView Controller");

	QUnit.test("I should test the stockView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
