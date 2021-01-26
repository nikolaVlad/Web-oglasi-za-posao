



/** Dodavanje slike na kod registracije  */
    $("#slika").on("change", function (e) {
    var reader = new FileReader();
    const file = e.target.files[0];
    reader.onload = function (e) {
    $("#slika_pregled").attr("src", e.target.result);
    };
    reader.readAsDataURL(file);
    });

    

/** Prikazi/Sakrij lozinku */
  var i = 0;
  var prikaziSakrij = () =>
  {
    

    if(i == 0)
    {  
        $("#logInLozinka").attr('type','text');
        i = 1;
    }
    else
    {
        $("#logInLozinka").attr('type','password');
        i = 0;
    }
  }




  /** Posalji mejl na kontakt stranici */
  var posaljiMejl = () =>
  {

    var body =  $("#poruka").val();
    var subject = $("#naslov").val();
    var ime = $("#ime").val() + '/n';
    window.open(`mailto:nikolavlad63@gmail.com?subject=${subject}&ime=${ime}&body=${body}`);
  }


 
  /** Detektovanje caps-lock-a */
  
    var lozinka =  document.getElementById('logInLozinka');
    var capsObavestenje = document.getElementById('capsObavestenje');
  

    if(lozinka)
    {
        lozinka.addEventListener('keyup',(event) =>
        {
            
            // Ako je ukljucen caps-lock
            if(event.getModifierState("CapsLock"))
            {
                capsObavestenje.style.visibility = "";
            }

            else
            {
                capsObavestenje.style.visibility = "hidden"
                
            }

        });
    }
  
