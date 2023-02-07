    self.onInit = function() {
      self.ctx.$scope.datasources = self.ctx.defaultSubscription.datasources;
      self.ctx.$scope.data = self.ctx.defaultSubscription.data;

      var svg$ = self.ctx.attributeService.getEntityAttributes({
        entityType: self.ctx.datasources[0].entityType,
        id: self.ctx.datasources[0].entityId
      }, 'SERVER_SCOPE', ['VHPIAsvg']);

      var svgToDisplay = '';

      if (self.ctx.datasources[0].type === 'function' || self.ctx.datasources[1].type === 'function') {
        svgToDisplay = '<svg id=\"placeholder\" width=\"210\" height=\"110\"><rect width=\"200\" height=\"100\" style=\"fill:lightgrey;\" /></svg>';
        update(svgToDisplay);
      } else {
        svg$.subscribe({
          next: (res) => {
            this.svgToDisplay = res[0].value;
            update(this.svgToDisplay)},
            error: err => console.log('svgAttr - error', err.message),
            complete: () => console.log('svgAttr- Completed')
        });
      }

      function update(str){
        self.ctx.$container.append(str);
        self.ctx.$container[0].getElementsByTagName('svg')[0].id = '#Map_generic_timeseries_table_with_svg_v2';
        var currentSvg = $('#Map_generic_timeseries_table_with_svg_v2', self.ctx.$container);

        var polys =  document.getElementById("#Map_generic_timeseries_table_with_svg_v2");

        var newpolygons =  Array.from(polys.querySelectorAll('polygon'));

        for (let i = 0; i < newpolygons.length; i++) {
          let pol = newpolygons[i];
          polyIds.push(pol.attributes[1].value);
        }
        for (let a = 0; a < polyIds.length; a++) {
          let polyId = polyIds[a];
          outerPolyjs.push($('#' + polyId + '', self.ctx.$container));

        self.ctx.$container.append("<div id='tooltip_generic_timeseries_table_with_svg_v2' class='tooltip'></div>");
        tooltip = $('#tooltip_generic_timeseries_table_with_svg_v2', tooltipContainer);
        var tooltip = $('#tooltip_generic_timeseries_table_with_svg_v2', self.ctx.$container);
        tooltip.append("<p id='tooltipKey_generic_timeseries_table_with_svg_v2' class='tooltipKey'></p><p id='tooltipValue_generic_timeseries_table_with_svg_v2' class='tooltipValue'></p>");
        var tooltipKey = $('#tooltipKey_generic_timeseries_table_with_svg_v2', tooltip);
        var tooltipValue = $('#tooltipValue_generic_timeseries_table_with_svg_v2', tooltip);
        tooltips.push(tooltip, tooltipKey, tooltipValue);
        }

       self.ctx.updateWidgetParams();
      }
    }

    var polyIds = [];
    var outerPolyjs = [];
    var tooltips = [];

    self.onDataUpdated = function() {
      var dataPairs = [];
      for (var i = 0; i < self.ctx.$scope.data.length; i++) {
        dataPairs[i] = [self.ctx.$scope.data[i].data, self.ctx.$scope.data[i].dataKey];
      }
      var polyTriads = [];
      for (var j = 0; j < outerPolyjs.length && j < dataPairs.length; j++) {
        polyTriads[j] = [dataPairs[j][0], dataPairs[j][1], outerPolyjs[j]];
      }
      tooltipsHTML = tooltips.map(el => el.get(0));
      var tooltipToDisplay = tooltipsHTML[0];
      var tooltipValueToDisplay = tooltipsHTML[2];
      var tooltipKeyToDisplay = tooltipsHTML[1];

      polyTriads.forEach(triad => {
        let valueArray = triad[0].map(res => res[1]);
        let currentValue = valueArray[0];
        let currentKey = triad[1].label;

        let criticalValues = valueArray.filter(el => el > 0.3)
        let alarmNumber = criticalValues.length;

        if(0 < alarmNumber && alarmNumber < 10) {
          triad[2].css('fill', '#ffb4a0');
        } else if(10 <= alarmNumber  && alarmNumber < 25) {
          triad[2].css('fill', '#ff8064');
        } else if(25 <= alarmNumber) {
          triad[2].css('fill', '#d0533c');
        } else {
          triad[2].css('fill', 'black');
        }

        //tooltips on polygons:
      triad[2].get(0).addEventListener("mouseover",
       function (evt) {
        var iconPos = triad[2].get(0).getBoundingClientRect();
        tooltipToDisplay.style.left = (iconPos.right + 20) + "px";
        tooltipToDisplay.style.top = (window.scrollY + iconPos.top - 120) + "px";
        tooltipToDisplay.style.display = "block";
        tooltipKeyToDisplay.innerText = "" + currentKey + "";
        tooltipValueToDisplay.innerText = "" + currentValue + "";
       });
      triad[2].get(0).addEventListener("mouseout",
       function (evt) {
        tooltipToDisplay.style.display = "none";
       });
      });

     self.ctx.detectChanges();
    }
