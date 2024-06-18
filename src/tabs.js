// Function to initialize tab-bg for each tab component
function initializeTabBg(tabMenu) {
    // Append the tab-bg element
    $(tabMenu).append('<div class="tab-bg"></div>');

    // Style the tab-bg element
    $(tabMenu).find('.tab-bg').css({
        'position': 'absolute',
        'bottom': '4px',
        'top': '4px',
        'height': 'auto', // Adjust height as needed
        'background-color': '#fff', // Adjust background color as needed
        'transition': 'left 0.3s ease', // Smooth transition
        'border-radius': '4px',
        'box-shadow': '0 4px 8px 1px rgba(12,14,22,.08)',
    });

    // Function to update the position and width of tab-bg
    function updateTabBg(target) {
        var $target = $(target);
        var leftPos = $target.position().left;
        var width = $target.outerWidth();

        $target.closest('.w-tab-menu').find('.tab-bg').css({
            'left': leftPos,
            'width': width
        });
    }

    // Initial position
    updateTabBg($(tabMenu).find('.w-tab-link.w--current'));

    // Event listener for tab click
    $(tabMenu).find('.w-tab-link').click(function(e) {
        e.preventDefault();
        $(tabMenu).find('.w-tab-link').removeClass('w--current');
        $(this).addClass('w--current');
        updateTabBg(this);
    });

    $(window).resize(function() {
        updateTabBg($(tabMenu).find('.w-tab-link.w--current'));
    });
}


function tabs() {
    // Initialize tab-bg for each tab component with the specified attribute
    $('[x-ordo-utils="tabs"]').each(function() {
        initializeTabBg(this);
    });
}

tabs()