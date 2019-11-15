var ItinFlights = [];
var ItinHotels = [];
var ItinFood = [];
var ItinActivities = [];

$(document).ready(function () {

    // Flights
    $('#OneWay').click(function (event) {
        // User clicked one way, return date no longer required.

    });
    $('#RoundTrip').click(function (event) {
        // User clicked round-trip, return date is required.
    });


    $('#FlightSearchBtn').click(function (event) {
        event.preventDefault();

        var origin = $('#OriginAirport').val();
        var destination = $('#DestinationAirport').val();
        var outboundDate = $('#OriginDate').val();
        var adults = $('#Passengers').val();

        if ($('#RoundTrip').is(':checked')) {
            // User selected round-trip flight
            var returnDate = $('#DestinationDate').val();

        } else {
            // User selected one-way flight
        }



        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/v1.0",
            "method": "POST",
            "headers": {
                "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
                "x-rapidapi-key": "0fabe6247amsh3cc35d831f1063ep17f222jsncb85460e2453",
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "country": "US",
                "currency": "USD",
                "locale": "en-US",
                "originPlace": "SFO-sky",
                "destinationPlace": "EWR-sky",
                "outboundDate": "2019-12-01",
                "adults": "1"
            }
        }

        var location = ""; // Returned location link

        $.ajax(settings).done(function (data, textStatus, xhr) {
            console.log(data);
            location = xhr.getResponseHeader("location");
            let split = location.lastIndexOf("/");
            location = location.substring(split + 1); // Only need last section of location response header.
            console.log(location);


            var url = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/uk2/v1.0/" + location + "?pageIndex=0&pageSize=10";

            var settingsGET = {
                "async": true,
                "crossDomain": true,
                "url": url,
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
                    "x-rapidapi-key": "0fabe6247amsh3cc35d831f1063ep17f222jsncb85460e2453"
                }
            }

            $.ajax(settingsGET).done(function (response) {
                console.log(response);
            });
        });
    }); // END flights
    

    // Hotel Section
    var hotelResults = false;
    $('#HotelSearch').click(function (event) {
        event.preventDefault();

        if (!hotelResults) {
            hotelResults = true;
            $('#HotelResults').click();
            $('#HotelResults').attr("hidden", false);
        }

        $('#HotelTableBody').html("<tr></tr>");

        var price = $('#price').val(); // Grabs current price selected in dropdown.

        var location = $('#city').val(); // Grabs city typed in by user

        var myurl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=hotel&location=" + location + "&price=" + price;

        $.ajax({
            url: myurl,
            headers: {
                'Authorization': 'Bearer zPrhArSQ32D_AxX3siNPykFx9dtzDnGZRu6iaKfeRMImzQznxnSUa8fWANQjECmNulLcZQI1yD6mGtJWbc3CAEUv9x_qOzJVP4kxy0v50iB3H8RWltf3xwTmpc_JXXYx',
            },
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                var count = 10;
                if (data.total < 10) {
                    count = data.total;
                }

                for (var i = 0; i < count; i++) {
                    console.log('success: ' + data.businesses[i].name);
                    let business = data.businesses[i];
                    $('#HotelTable tr:last').after('<tr id=ROW' + business.id + '><td><img class="thumbnails" src='
                        + business.image_url + '></td><td>' + business.location.city + '</td><td>'
                        + business.name + '</td><td>' + business.rating + '</td><td>' + business.price
                        + '</td><td><button class="btn btn-warning hotelInfo ItinRelated" id=' + business.id + '>Add</button></td></tr>');
                }
            }
        });

    });


    // ADD & REMOVE BUTTONS FOR ITINERARY
    var hotelCount = 0; // To keep track of how many indexes for hotels
    var foodCount = 0; // To keep track of how many indexes for food
    $('body').on('click', '.btn', function () {
        var addedID = "";
        if ($(this).hasClass('ItinRelated')) {
            addedID = "#ROW" + $(this).attr('id');
            $(this).html("Added");
            $(this).addClass("btn-secondary"); // Change button color to gray
            $(this).attr('disabled', true); // Disable button
            $(this).removeClass("btn-warning"); // Remove "yellow" color class
        }

        if ($(this).hasClass('hotelInfo')) {
            ItinHotels.push($(addedID)); // Pushing table row onto saved itinerary
            let hotelToAdd = ItinHotels[hotelCount][0].cells;
            $('#ItinHotel tr:last').after('<tr id=ROW' + ItinHotels[hotelCount][0].id + '><td>' + hotelToAdd[0].innerHTML + '</td><td>'
                + hotelToAdd[2].textContent
                + '</td><td>' + hotelToAdd[1].textContent
                + '</td><td>' + hotelToAdd[4].textContent + '</td><td>'
                + '<a href="#">Yelp Link</a>' + '</td><td><button id='
                + ItinHotels[hotelCount][0].id + ' class="btn btn-danger removeItin"><img src="img/delete_outline-24px.svg"></button></td></tr>');
            hotelCount++;
        }

        if ($(this).hasClass('foodInfo')) {
            ItinFood.push($(addedID));
            let foodToAdd = ItinFood[foodCount][0].cells;
            $('#ItinFood tr:last').after('<tr id=ROW' + ItinFood[foodCount][0].id + '><td>' + foodToAdd[0].innerHTML
                + '</td><td>' + foodToAdd[2].textContent + '</td><td>' + foodToAdd[1].textContent
                + '</td><td>' + foodToAdd[4].textContent + '</td><td><a href="#">Yelp Link</a></td><td><button id=' 
                + ItinFood[foodCount][0].id + ' class="btn btn-danger removeItin"><img src="img/delete_outline-24px.svg"></button></td></tr>');
            foodCount++;
        }

        if ($(this).hasClass('removeItin')) { // If a remove button is clicked.
            let removeID = "#ROW" + $(this).attr('id');
            $(removeID).remove();
        }
    });

    // Food Section
    var FoodResults = false;
    $('#FoodSearch').click(function (event) {
        event.preventDefault();

        if (!FoodResults) {
            FoodResults = true;
            $('#FoodResults').click();
            $('#FoodResults').attr("hidden", false);
        }

        $('#FoodTableBody').html("<tr></tr>");

        var price = $('#FoodPrice').val(); // Grabs current price selected in dropdown.
        var food = $('#Food').val(); // Grabs food
        var location = $('#FoodCity').val(); // Grabs city typed in by user

        var myurl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + food + "&location=" + location + "&price=" + price + "&categories=restaurants";

        $.ajax({
            url: myurl,
            headers: {
                'Authorization': 'Bearer zPrhArSQ32D_AxX3siNPykFx9dtzDnGZRu6iaKfeRMImzQznxnSUa8fWANQjECmNulLcZQI1yD6mGtJWbc3CAEUv9x_qOzJVP4kxy0v50iB3H8RWltf3xwTmpc_JXXYx',
            },
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                var count = 10;
                if (data.total < 10) {
                    count = data.total;
                }

                for (var i = 0; i < count; i++) {
                    console.log('success: ' + data.businesses[i].name);
                    let business = data.businesses[i];
                    $('#FoodTable tr:last').after('<tr id=ROW' + business.id + '><td><img class="thumbnails" src=' + business.image_url + '></td><td>'
                        + business.location.city + '</td><td>' + business.name
                        + '</td><td>' + business.rating + '</td><td>'
                        + business.price + '</td><td><button class="btn btn-warning foodInfo ItinRelated" id=' + business.id + '>Add</button></td></tr>');
                }
            }
        });

    });
});