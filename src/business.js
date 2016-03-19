(function () {
  var moment;
  moment = (typeof require !== "undefined" && require !== null) &&
           !require.amd ? require("moment") : this.moment;

  moment.fn.businessDiff = function (start) {
    start = moment(start);
    var end = this.clone();
    var start_offset = start.day() - 7;
    var end_offset = end.day();

    var end_sunday = end.clone().subtract('d', end_offset);
    var start_sunday = start.clone().subtract('d', start_offset);
    var weeks = end_sunday.diff(start_sunday, 'days') / 7;

    start_offset = Math.abs(start_offset);
    if(start_offset == 7)
      start_offset = 5;
    else if(start_offset == 1)
      start_offset = 0;
    else
      start_offset -= 2;


    if(end_offset == 6)
      end_offset--;

    return weeks * 5 + start_offset + end_offset;
  };

  moment.fn.businessAdd = function (days) {
    var d = this.clone().add('d', Math.floor(days / 5) * 7);
    var remaining = days % 5;
    while(remaining){
      d.add('d', 1);
      if(d.day() !== 0 && d.day() !== 6)
        remaining--;
    }
    return d;
  };

}).call(this);

function getBusinessDays(start) {
  // Todo: accept yearless dates
  var startMoment = moment(start);
  var now = moment();
  result = Math.floor(now.businessDiff(startMoment));
  alert(result + " business days");
  return result;
}

chrome.contextMenus.create({title: "Business days since %s",
                             contexts:["selection"],
                              onclick: function(info, tab){
                                var diff = getBusinessDays(info.selectionText);
                              }
});

chrome.commands.onCommand.addListener(function(command) {
  var text = window.getSelection().toString();
});
