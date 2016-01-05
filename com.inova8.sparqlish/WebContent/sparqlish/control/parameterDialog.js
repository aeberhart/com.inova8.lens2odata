jQuery.sap.require("sap.m.P13nDialog");
jQuery.sap.require("sap.m.P13nColumnsPanel");
jQuery.sap.require("sap.m.P13nItem");
sap.ui.core.Control.extend("sparqlish.control.parameterDialog", {
	metadata : {
		properties : {
			queryContext : {
				type : "object"
			}
		},
		aggregations : {},
		events : {}
	},
	open : function() {
		this.oDialog.open();
	},
	setQueryContext : function(oQueryContext) {
		var self = this;
		self.setProperty("queryContext", oQueryContext);
		self.oParameterForm.getFormContainers()[0].bindAggregation("formElements", "serviceQueriesModel>" + oQueryContext.getPath() + "/parameters",
				this._initValueInputFactory.bind(this)
		);
	},
	init : function(queryContext) {
		var self = this;
		self.oParameterForm = new sap.ui.layout.form.Form({
			layout : new sap.ui.layout.form.GridLayout({
				singleColumn : false
			}),
			formContainers : [ new sap.ui.layout.form.FormContainer({
				expandable : true
			}) ]
		});

		self.oDialog = new sap.m.Dialog({
			title : "{i18nModel>parameterDialogTitle}",
			endButton : new sap.m.Button({
				text : 'Submit',
				press : function() {
					self.oDialog.close();
				}
			})
		});
		self.oParameterPanel = new sap.m.Panel();
		self.oParameterPanel.addContent(self.oParameterForm);
		self.oDialog.addContent(self.oParameterPanel);

	},
	_initValueInputFactory : function(sId, oContext) {
		var oInputValue = null
		switch (oContext.getProperty("type")) {
		case "Edm.Date":
			oInputValue = (new sap.m.DatePicker({
				valueFormat : 'yyyy-MM-ddThh:mm:ssXX',
				tooltip : "{serviceQueriesModel>prompt}",
				width : "auto",
				placeholder : "{serviceQueriesModel>prompt}",
				description : "",
				editable : true,
				showValueHelp : true,
				valueHelpRequest : ""
			})).addStyleClass("dataPropertyValue");
			break;
		case "Edm.DateTime":
			oInputValue = (new sap.m.DatePicker({
				valueFormat : 'yyyy-MM-ddThh:mm:ssXX',
				tooltip : "{serviceQueriesModel>prompt}",
				width : "auto",
				placeholder : "{serviceQueriesModel>prompt}",
				description : "",
				editable : true,
				showValueHelp : true,
				valueHelpRequest : ""
			})).addStyleClass("dataPropertyValue");
			break;
		case "Edm.Time":
			oInputValue = (new sap.m.TimePicker({
				valueFormat : 'yyyy-MM-ddThh:mm:ssXX',
				tooltip : "{serviceQueriesModel>prompt}",
				width : "auto",
				placeholder : "{serviceQueriesModel>prompt}",
				description : "",
				editable : true,
				showValueHelp : true,
				valueHelpRequest : ""
			})).addStyleClass("dataPropertyValue");
			break;
		case "Edm.Decimal":
		case "Edm.Double":
		case "Edm.Single":
		case "Edm.Int16":
		case "Edm.Int32":
		case "Edm.Int64":
			oInputValue = (new sap.m.Input({
				type : sap.m.InputType.Number,
				tooltip : "{serviceQueriesModel>prompt}",
				width : "auto",
				placeholder : "{serviceQueriesModel>prompt}",
				description : "",
				editable : true,
				showValueHelp : true,
				valueHelpRequest : ""
			})).addStyleClass("dataPropertyValue");
			break;
		default:
			oInputValue = (new sap.m.Input({
				tooltip : "{serviceQueriesModel>prompt}",
				width : "auto",
				placeholder : "{serviceQueriesModel>prompt}",
				description : "",
				editable : true,
				showValueHelp : true,
				valueHelpRequest : ""
			})).addStyleClass("dataPropertyValue");
		}
		oInputValue.bindProperty("value", "serviceQueriesModel>defaultValue")

		var oFormElement = new sap.ui.layout.form.FormElement({
			label : "{serviceQueriesModel>name}",
			fields : [ oInputValue ],
			layoutData : new sap.ui.layout.form.GridElementData({
				hCells : "2"
			})
		});
		return oFormElement;
	},
	renderer : function(oRm, oControl) {
	}
});