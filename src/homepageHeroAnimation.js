var Webflow = window.Webflow || [];

// Select the target element
const targetElement = document.querySelector('[x-ordo-utils="homepageHeroAnimation"]');

let isElementInView = false;

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            isElementInView = true;
            startScrollTracking();
        } else {
            isElementInView = false;
            stopScrollTracking();
        }
    });
}, {
    root: null, // Use the viewport as the root
    threshold: 0 // Trigger when 0% of the element is visible
});

window.addEventListener('DOMContentLoaded', (event) => {
    // DOMready has fired
    // May now use jQuery
    if(!targetElement) {
        console.error("No targetElement found");
        return
    }
    observer.observe(targetElement);
})

function startScrollTracking() {
    window.addEventListener('scroll', handleScroll);
}

function stopScrollTracking() {
    window.removeEventListener('scroll', handleScroll);
}

function handleScroll() {
    if (isElementInView) {
        // Calculate the element's position relative to the viewport
        const elementRect = targetElement.getBoundingClientRect();

        // Calculate the scroll percentage based on the element's position
        // The percentage will be between 0 and 1
        const scrollPercentage = Math.max(
            0,
            Math.min(
                1,
                (window.innerHeight - elementRect.top) / (window.innerHeight + elementRect.height)
            )
        );

        animateFeatures(scrollPercentage);
        animateBrowzer(scrollPercentage);
    }
}


function animateFeatures(scrollPercentage) {
    // 38%
    Webflow.tram('.hero .feature_block._1').add('opacity 0.5s ease-in-out')
        .set(scrollPercentage >= 0.55 ? { opacity: 1 } : { opacity: 0 })
        .start(scrollPercentage >= 0.55 ? { opacity: 1 } : { opacity: 0 })
        .then(function () {
            console.log('done!');
        });

    // 47%
    Webflow.tram('.hero .feature_block._2').add('opacity 0.5s ease-in-out')
        .set(scrollPercentage >= 0.64 ? { opacity: 1 } : { opacity: 0 })
        .start(scrollPercentage >= 0.64 ? { opacity: 1 } : { opacity: 0 })
        .then(function () {
            console.log('done!');
        });
    Webflow.tram('.hero .img_change._1').add('opacity 0.5s ease-in-out')
        .set(scrollPercentage >= 0.64 ? { opacity: 0 } : { opacity: 1 })
        .start(scrollPercentage >= 0.64 ? { opacity: 0 } : { opacity: 1 })
        .then(function () {
            console.log('done!');
        });

    // 54%
    Webflow.tram('.hero .feature_block._3').add('opacity 0.5s ease-in-out')
        .set(scrollPercentage >= 0.70 ? { opacity: 1 } : { opacity: 0 })
        .start(scrollPercentage >= 0.70 ? { opacity: 1 } : { opacity: 0 })
        .then(function () {
            console.log('done!');
        });
    Webflow.tram('.hero .img_change._2').add('opacity 0.5s ease-in-out')
        .set(scrollPercentage >= 0.70 ? { opacity: 0 } : { opacity: 1 })
        .start(scrollPercentage >= 0.70 ? { opacity: 0 } : { opacity: 1 })
        .then(function () {
            console.log('done!');
        });

    // 65%
    Webflow.tram('.hero .feature_block._4').add('opacity 0.5s ease-in-out')
        .set(scrollPercentage >= 0.78 ? { opacity: 1 } : { opacity: 0 })
        .start(scrollPercentage >= 0.78 ? { opacity: 1 } : { opacity: 0 })
        .then(function () {
            console.log('done!');
        });
    Webflow.tram('.hero .img_change._3').add('opacity 0.5s ease-in-out')
        .set(scrollPercentage >= 0.78 ? { opacity: 0 } : { opacity: 1 })
        .start(scrollPercentage >= 0.78 ? { opacity: 0 } : { opacity: 1 })
        .then(function () {
            console.log('done!');
        });
    Webflow.tram('.hero .teaser-column.left .button.is-grey').add('opacity 0.5s ease-in-out')
        .set(scrollPercentage >= 0.78 ? { opacity: 1 } : { opacity: 0 })
        .start(scrollPercentage >= 0.78 ? { opacity: 1 } : { opacity: 0 })
        .then(function () {
            console.log('done!');
        });
}

function animateBrowzer(scrollPercentage) {
    // 0%
    Webflow.tram('.hero .browzer.last').add('transform 1s ease-out-quint')
        .set(scrollPercentage <= 0.53 && { y:0 })
        .start(scrollPercentage <= 0.53 && { y:0 })
        .then(function () {
            console.log('done!');
        });
    Webflow.tram('.hero .browzer.second').add('transform 1s ease-out-quint')
        .set(scrollPercentage <= 0.53 && { y:0 })
        .start(scrollPercentage <= 0.53 && { y:0 })
        .then(function () {
            console.log('done!');
        });

    // 10%
    Webflow.tram('.navbar_background').add('opacity 1s ease-out-quint')
        .start(scrollPercentage <= 0.42 ? { opacity:0 } : { opacity: 1 })
        .then(function () {
            console.log('done!');
        });


     // 14%
    Webflow.tram('.hero .homehero_max-width-heading.align-center').add('opacity 1s ease-out-quint')
        .start(scrollPercentage <= 0.49 ? { opacity:1 } : { opacity: 0 })
        .then(function () {
            console.log('done!');
        });

     // 15%
    Webflow.tram('.hero .header_img_1, .hero .header_img_2').add('transform 1s ease-out-quint')
        .start(scrollPercentage <= 0.53 && { x: 0})
        .then(function () {
            console.log('done!');
        });
   // 17%
    Webflow.tram('.hero .padding-top.padding-xsmall').add('opacity 1s ease-out-quint')
        .start(scrollPercentage <= 0.52 ? { opacity: 1} : { opacity: 0 })
        .then(function () {
            console.log('done!');
        });

    // 20%
    let pTeaserTransform
    if(scrollPercentage <= 0.53 ) {
        pTeaserTransform = { scaleX: 1.5, scaleY: 1.5, x: '-17%', y: '15.8%' }
    } else if(scrollPercentage >= 0.54 ) {
        pTeaserTransform = { scaleX: 1, scaleY: 1, x: 0, y: 0 }
    }

    Webflow.tram('.hero .p-teaser-img-wrap').add('transform 2s ease-in-out')
        .set(pTeaserTransform)
        .start(pTeaserTransform)

    // 24%
    Webflow.tram('.hero .browzer.last').add('transform 1s ease-out-quint')
        .start(scrollPercentage >= 0.53 && { y: 20.5 })

    // 25%
    Webflow.tram('.hero .browzer.second').add('transform 1s ease-out-quint')
        .start(scrollPercentage >= 0.53 && { y: 10.5 })

    // 40%
    Webflow.tram('.hero .header_img_2').add('transform 3s ease-out')
        .start(scrollPercentage >= 0.54 && { y: '-50%'})
    Webflow.tram('.hero .header_img_1').add('transform 3s ease-out')
        .start(scrollPercentage >= 0.54 && { y: '-10%'})
}
