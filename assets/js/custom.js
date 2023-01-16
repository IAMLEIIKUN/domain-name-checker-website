
// render calendar
if (jQuery('div#event-calendar').length > 0) {
    jQuery.ajax({
        url: baseurl + 'GoogleCalendar/getCalendar',
        dataType: 'html',
        beforeSend: function () {
            $('#event-calendar').html('<div class="text-center mrgA padA"><i class="fa fa-spinner fa-pulse fa-4x fa-fw"></i></div>');
        },
        complete: function () {
            jQuery('[data-caltoggle="tooltip"]').tooltip();
        },
        success: function (html) {
            jQuery('#event-calendar').html(html);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

// render calendar with navigation
jQuery(document).on("click", "a.calnav", function (e) {
    e.preventDefault();
    var page = jQuery(this).data("calvalue");
    jQuery.ajax({
        url: baseurl + 'GoogleCalendar/getCalendar',
        type: 'post',
        data: {page: page},
        dataType: 'html',
        beforeSend: function () {
            $('#event-calendar').html('<div class="text-center mrgA padA"><i class="fa fa-spinner fa-pulse fa-4x fa-fw"></i></div>');
        },
        complete: function () {
            jQuery('[data-caltoggle="tooltip"]').tooltip();
        },
        success: function (html) {
            jQuery('#event-calendar').html(html);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});


// render calendar change month 
jQuery(document).on("change", "#setMonthVal", function (e) {
    e.preventDefault();
    var month = this.value;
    var year = jQuery('#setYearVal > option:selected').val();
    jQuery.ajax({
        url: baseurl + 'GoogleCalendar/getCalendar',
        type: 'post',
        data: {year: year, month: month},
        dataType: 'html',
        beforeSend: function () {
            $('#event-calendar').html('<div class="text-center mrgA padA"><i class="fa fa-spinner fa-pulse fa-4x fa-fw"></i></div>');
        },
        complete: function () {
            jQuery('[data-caltoggle="tooltip"]').tooltip();
        },
        success: function (html) {
            jQuery('#event-calendar').html(html);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

});

// render calendar change year 
jQuery(document).on("change", "#setYearVal", function (e) {
    e.preventDefault();
    var year = this.value;
    var month = jQuery('#setMonthVal > option:selected').val();
    jQuery.ajax({
        url: baseurl + 'GoogleCalendar/getCalendar',
        type: 'post',
        data: {year: year, month: month},
        dataType: 'html',
        beforeSend: function () {
            $('#event-calendar').html('<div class="text-center mrgA padA"><i class="fa fa-spinner fa-pulse fa-4x fa-fw"></i></div>');
        },
        complete: function () {
            jQuery('[data-caltoggle="tooltip"]').tooltip();
        },
        success: function (html) {
            jQuery('#event-calendar').html(html);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

});

jQuery(document).on('click', 'a.google-event', function() {
    var google_event_date = jQuery(this).data('google_event');
    $.ajax({
        url: baseurl + "GoogleCalendar/viewEvent",
        type: 'post',
        data: {google_event_date: google_event_date},
        dataType: 'html',
        beforeSend: function () {
            jQuery('span#render-google-cal-data').html('<div class="text-center"><i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div>');
        },
        success: function (html) {
            jQuery('span#render-google-cal-data').html(html); 
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});

function pad(num, size) {
    var s = num + "";
    while (s.length < size)
        s = "0" + s;
    return s;
}

jQuery(document).on("click", "a.add-gc-event", function () {
    var myYear = jQuery(this).data('year');
    var myMonth = jQuery(this).data('month');
    var myDays = pad(jQuery(this).data('days'), 2);
    var completeDate = myYear + '-' + myMonth + '-' + myDays;   
    $.ajax({
        url: baseurl + "GoogleCalendar/renderEventForm",
        type: 'post',
        data: {datetime: completeDate},
        dataType: 'html',
        beforeSend: function () {
            jQuery('span#render-google-cal-add').html('<div class="text-center"><i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div>');
        },
        success: function (html) {
            jQuery('span#render-google-cal-add').html(html); 
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});

jQuery(document).on('click', 'button#save-gc-event', function(){
    jQuery.ajax({
        type:'POST',
        url:baseurl+'GoogleCalendar/addEvent',
        data:jQuery("form#gc-event-frm").serialize(),
        dataType:'json',    
        beforeSend: function () {
            jQuery('button#save-gc-event').button('loading');
        },
        complete: function () {
            jQuery('button#ssave-gc-event').button('reset');
            jQuery('form#gc-event-frm').find('textarea, input').each(function () {
                jQuery(this).val('');
            });
            setTimeout(function () {
                jQuery('span#success-msg').html(''),
                jQuery('gc-create-event').modal('hide'),
                location.reload()
            }, 3000);
        },                
        success: function (json) {
           $('.text-danger').remove();
            if (json['error']) {
                for (i in json['error']) {
                    var element = $('.input-gcevent-' + i.replace('_', '-'));
                    if ($(element).parent().hasClass('form-row')) {
                        $(element).parent().after('<div class="text-danger" style="font-size: 14px;">' + json['error'][i] + '</div>');
                    } else {
                        $(element).after('<div class="text-danger" style="font-size: 14px;">' + json['error'][i] + '</div>');
                    }
                }
            } else {
                jQuery('span#success-msg').html('<div class="alert alert-success">Your Event has been successfully created.</div>');
            }                       
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }        
    });
});
