jQuery.sap.require("sparqlish.control.conceptFilter");
jQuery.sap.require("sparqlish.control.iconLink");
sap.ui.core.Control.extend("sparqlish.control.conceptFilters", {
	metadata : {
		aggregations : {
			_conceptFilters : {
				type : "sparqlish.control.conceptFilter",
				multiple : true
			},
			_extendFilter : {
				type : "sparqlish.control.iconLink",
				multiple : false
			}
		}
	},
	getCurrentQueryContext : function() {
		var currentQueryContext = this.getModel("queryModel").getProperty("", this.getBindingContext("queryModel"));
		if (currentQueryContext == undefined) {
			this.getModel("queryModel").setProperty(this.getBindingContext("queryModel").getPath(), []);
			return this.getModel("queryModel").getProperty("", this.getBindingContext("queryModel"));
		}else{
			return currentQueryContext;
		}
	},
	extendFilter : function() {
		var currentQueryContext = this.getCurrentQueryContext();
		var keyId = this.getModel("metaModel").getODataEntityType(this.getParent().getRangeEntityTypeQName()).key.propertyRef[0].name;
		var keyProperty = getProperty(this.getParent().getRangeEntityTypeQName(),keyId);
		currentQueryContext.push([{key:keyId,value:"[enter new value]",type:keyProperty.type}]);
	},
	init : function() {
		var self = this;
		self.bindAggregation("_conceptFilters", "queryModel>", new sparqlish.control.conceptFilter({
			// conceptFilter : "{Id}",
			deleted : function(oEvent) {
				// TODO is this really the best way to delete an element?
				var me = oEvent.getSource().me;
				var currentContext = me.getBindingContext("queryModel");
				var currentModelData = me.getModel("queryModel").getProperty("", currentContext);
				var path = currentContext.getPath().split("/");
				var index = path[path.length - 1];
				var conceptFiltersContextPath = currentContext.getPath().slice(0, -(1 + index.length))
				var conceptFiltersContext = new sap.ui.model.Context("queryModel", conceptFiltersContextPath);
				var currentModelData = me.getModel("queryModel").getProperty("", conceptFiltersContext);
				currentModelData.splice(index, 1);

				self.getModel("queryModel").refresh();
				self.getParent().rerender();
			}
		}));
		self.setAggregation("_extendFilter", new sparqlish.control.iconLink({
			text : "add-filter",
			icon : "add-filter",
			tooltip : "Add a filter value",
			visible : true,
			press : function(oEvent) {
				self.extendFilter();
				self.getAggregation("_extendFilter").setVisible(true);
				self.getModel("queryModel").refresh();
				self.getParent().rerender();
//				self.getAggregation("_conceptFilters")[1].oConceptFilterPopup.close();
//				self.getAggregation("_conceptFilters")[1].oConceptFilterLink.firePress();
			}
		}));
	},
	renderer : function(oRm, oControl) {
		var conceptFilters = oControl.getAggregation("_conceptFilters");
		if (conceptFilters != null) {
			for (var i = 0; i < conceptFilters.length; i++) {
				if (i > 0) {
					oRm.write(sap.ui.getCore().getModel("i18nModel").getProperty("conceptClauseConjunction"));
				} else {
					oRm.write("&nbsp;");
					oRm.write(sap.ui.getCore().getModel("i18nModel").getProperty("conceptClauseIn"));
				}
				oRm.renderControl(conceptFilters[i]);
			}
		}
		oRm.write("&nbsp;");
		oRm.renderControl(oControl.getAggregation("_extendFilter"));
	}
});