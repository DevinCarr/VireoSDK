//****************************************
// Tests for RingSelectorViewModel class
// National Instruments Copyright 2015
//****************************************

describe('A RingSelectorViewModel', function () {
    'use strict';
    var $ = NationalInstruments.Globals.jQuery;

    var controlId = 'RingSelectorViewModelId';

    var viModel, frontPanelControls, controlModel, controlElement, settings, updateSettings, updateSettings2, newIndex, newDisplayValue;
    var webAppHelper = testHelpers.createWebAppTestHelper();

    beforeAll(function (done) {
        webAppHelper.installWebAppFixture(done, function (newVIModel) {
            viModel = newVIModel;
        });
    });

    beforeEach(function () {
        newIndex = 8;
        newDisplayValue = '<' + newIndex + '>';

        settings = {
            niControlId: controlId,
            kind: NationalInstruments.HtmlVI.Models.RingSelectorModel.MODEL_KIND,
            visible: true,
            readOnly: false,
            value: 0,
            allowUndefined: false,
            items: [{ value: 0, displayValue: 'first'}, { value: 2, displayValue: 'second'}, { value: 10, displayValue: 'third'}],
            left: '100px',
            top: '200px',
            width: '300px',
            height: '400px'
        };
        updateSettings = {
            allowUndefined: true,
            value: 2
        };
        updateSettings2 = {
            value: newIndex
        };
        Object.freeze(settings);
        Object.freeze(updateSettings);
    });

    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });

    it('allows elements to be added directly to the page', function (done) {
        $(document.body).append('<ni-ring-selector ni-control-id="' + controlId + '"></ni-ring-selector>');
        testHelpers.runAsync(done, function () {
            var viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });

    describe('exists after the custom element is created', function () {
        var viewModel;

        beforeEach(function (done) {
            webAppHelper.createNIElement(settings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                controlModel = frontPanelControls[controlId];
                viewModel = viModel.getControlViewModel(controlId);
                controlElement = viewModel.element;
            });
        });

        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });

        it('and has the correct initial values.', function (done) {
            expect(controlModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(controlModel.allowUndefined).toEqual(settings.allowUndefined);
            expect(controlModel.value).toEqual(settings.value);
            expect(controlModel.items).toEqual(settings.items);
            testHelpers.runAsync(done, function () {
                expect($(controlElement.children[1]).css('display')).toEqual('none');
            });
        });

        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, updateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.allowUndefined).toEqual(updateSettings.allowUndefined);
                expect(controlModel.value).toEqual(updateSettings.value);
                expect($(controlElement.children[1]).css('display')).toEqual('block');
            });
        });

        it('set the value property to a non existing value.', function (done) {
            webAppHelper.dispatchMessage(controlId, updateSettings2);
            testHelpers.runAsync(done, function () {
                expect(controlModel.value).toEqual(updateSettings2.value);
                var newValue = $(controlElement.firstElementChild.firstElementChild).jqxDropDownList('val');
                expect(newValue).toEqual(newDisplayValue);
            });
        });

        it('and handles unknown property changes.', function (done) {
            var unknownSettings = {
                unknown: 'unknown'
            };
            webAppHelper.dispatchMessage(controlId, unknownSettings);

            testHelpers.runAsync(done, function () {
                expect(controlModel.allowUndefined).toEqual(settings.allowUndefined);
                expect(controlModel.value).toEqual(settings.value);
                expect(controlModel.items).toEqual(settings.items);
            });
        });
    });

    it('responds to the jqx selectIndex method and sets the new selected index.', function (done) {
        controlElement = webAppHelper.createNIElement(settings);
        testHelpers.runAsync(done, function () {
            var internalControl = controlElement.firstElementChild.firstElementChild;
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            $(internalControl).jqxDropDownList('selectIndex', 2);

            expect(controlModel.value).toEqual(10);
            webAppHelper.removeNIElement(controlId);
        });
    });
});