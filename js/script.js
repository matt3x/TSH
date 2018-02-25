
/* Ustawiamy zewnętrznego API */
var api_url = 'http://test-api.kuria.tshdev.io/'  


/* Główna aplikacja */
function majorapp(url) {

	var current_page = 0

	$.ajax({
	type:"GET", 
	url: url,
	cache : false,  	
	success: function(data) {
			$("#data, #pagination ul").empty();
			if (data == 'An error occured!') { 
				$("#pagination").fadeOut(150);
				$('#data').append('<figure class="sys-alert no-results"><div class="inner"><h2>No results</h2><p>Try another query or click <strong onclick="resetform();">Reset</strong></p></div></figure>');
			} else {
				$.each(JSON.parse(data), function(key, value) {
					
					$(".sys-alert").fadeOut(150);
					$("#pagination").fadeIn(150);

					/* Ok. Pora na content tabelkę - jazda! */
					if(key === 'payments') { 

						$.each( value, function( payments_key, payments_val ) {
						  $("#pagination").fadeIn(150);
						  $('#data').append('<figure class="row"><div class="col-lg-5 col-md-4 col-sm-6 col-xs-12 order-md-1 order-sm-1 ">'+this.payment_supplier+'</div><div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 order-md-2 order-sm-3"><ul class="rating rated-'+this.payment_cost_rating+'"><li>£</li><li>£</li><li>£</li><li>£</li><li>£</li></ul></div><div class="col-lg-2 col-md-2 col-sm-6 col-6 order-md-3 order-sm-2">'+this.payment_ref+'<span class="invisible"> (Reference)</span></div><div class="col-lg-2 col-md-2 col-sm-6 col-6 order-md-4 order-sm-4">£ '+this.payment_amount.replace(/\./g, ',')+'<span class="invisible"> (Value)</span></div></figure>');
						});

					}

					/* Ojj... Trafiłem na paginację... no to rysujemy...*/
					if(key === 'pagination') { 

						$.each( value, function( pagination_key, pagination_val ) {

							/* Ok, teraz już wiem gdzie jestem */
							if (pagination_key === 'current') { current_page = pagination_val}

							/* No to lecim z liczbą stron */
							if(pagination_key === 'links') {
								$.each(pagination_val, function( page_no, page_url ) {
									$('#pagination ul').append('<li' + ((page_no ==  current_page) ? ' class="page-no active" ' : ' class="page-no" ') + ' data-url='+page_url+'>'+(parseInt(page_no) + 1)+'</li>');
								});
							}

							/* Tiaa... wiem... straszne chałupnictwo... cóż... uczę się ;)  */
							if(pagination_key == 'left') {
								if(pagination_val === false) {$('#pagination .prev').attr('disabled','disabled')} else {$('#pagination .prev').removeAttr('disabled')};
							}
							if(pagination_key == 'right') {
								if(pagination_val === false) {$('#pagination .next').attr('disabled','disabled')} else {$('#pagination .next').removeAttr('disabled')};
							}

						});
					}
				});
			}
		},
		error: function (xhr, status) { 
          $('#data').empty().append('<figure class="sys-alert error"><div class="inner"><h2>Something went wrong...</h2><p>Try <strong onclick="resetform()">again</strong> later or contact with IT support.</p></div></figure>');
		  $("#pagination").fadeOut(150);
        }
	});
}
	

/* Uruchamiamy paginację */
$("#pagination").on("click", "li.page-no:not(.active)", function(event){
	majorapp((api_url+'?'+$(this).data("url")));
});

/* Przycisk prev */
$("#pagination").on("click", "li.prev", function(event){
	majorapp((api_url+'?'+$("#pagination .active").prev().data("url")));		
});

/* I oczywiście przycisk nav */
$("#pagination").on("click", "li.next", function(event){
	majorapp((api_url+'?'+$("#pagination .active").next().data("url")));
});

/* Formularz do wyszukiwania */
$("#form").submit(function(e) {
	majorapp(api_url+'?'+$("#form").serialize());
	e.preventDefault();
});

function resetform() {
   $("#form").trigger("reset");
	majorapp(api_url);
};

/* Wołamy O :D aplikację po wejściu na stronę i jej odświeżeniu */
$(document).ready(function(){
	majorapp(api_url);
});

/* Modal */
/* Tiaa... wiem!... no tutaj to będzie istny szał.. */
$(document).on('click', 'figure:not(.sys-alert)', function(){
  $('body').addClass('modal-open');
	  $( ".modal-body h2" ).html($(this).children(":first").text());
	  $( "#modal-data > div:nth-child(1) > div" ).html($(this).children("div:nth-child(2)").html());
	  $( "#modal-data > div:nth-child(2) h3" ).html($(this).children("div:nth-child(3)").html());
	  $( "#modal-data > div:nth-child(3) h3" ).html($(this).children("div:nth-child(4)").html());
	  $( "#close" ).click(function() {
		  $('.modal-body').addClass('out');
		   setTimeout(function() {
			  $('body').removeClass('modal-open');
			  $('.modal-body').removeClass('out');
		   }, 150);
	  });
});

/* Ok. Drogi Sprawdzaczu Programisto! Finezji tutaj nie znajdziesz, jednak... cieszę się że tu dotarłeś! I tak... jestem świadomy - jeszcze długa droga :) Udanego! */