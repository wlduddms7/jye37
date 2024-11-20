/*global QUnit*/

sap.ui.define([
	"cl3syncyoungmmdoc/docu/controller/docList.controller"
], function (Controller) {
	"use strict";

	QUnit.module("docList Controller");

	QUnit.test("I should test the docList controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
