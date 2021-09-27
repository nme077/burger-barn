// pagination for menu
document.querySelectorAll('.menu-select').forEach(el => {
    el.addEventListener('click', () => {
        if(document.querySelector('.active-menu')) {
            document.querySelector('.active-menu').classList.remove('active-menu');
        }
        el.classList.add('active-menu');

        document.querySelector('.active-menu-section').classList.remove('active-menu-section');
        document.querySelector('.'+el.id).classList.add('active-menu-section');
    })
})

// Enable smooth scrolling in all browsers
$("a").on("click", function (e) {
    // 1
    e.preventDefault();
    // 2
    const href = $(this).attr("href");
    // 3
    $("html, body").animate({ scrollTop: $(href).offset().top }, 500);
  });