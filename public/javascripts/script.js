

// Dodavanje slike na kod registracije
    $("#slika").on("change", function (e) {
    var reader = new FileReader();
    const file = e.target.files[0];
    reader.onload = function (e) {
    $("#slika_pregled").attr("src", e.target.result);
    };
    reader.readAsDataURL(file);
    });
