function accordion() {
    const accordionList = $('[x-ordo-utils=accordion]');
    accordionList.each(function(i, elem) {
        const $accordion = $(elem);
        const $questions = $accordion.find('[data-accordion-elem=question]');
        const $answers = $accordion.find('[data-accordion-elem=answer]');

        $answers.hide(); // Hide all answers initially

        $questions.on('click', function() {
            const $this = $(this);
            const $answer = $this.next('[data-accordion-elem=answer]');
            const $icon = $this.find('[data-accordion-elem=icon]');

            // Slide up all answers except the one being clicked
            $answers.not($answer).slideUp();

            $this.toggleClass('open')

            // Toggle the 'open' class and text
            $answer.slideToggle({
                duration: 300,
            });
            if ($this.hasClass('open')) {
                $icon.css({'transform': 'rotate(90deg)', 'display': 'inline-block', transition: 'all 0.3s ease'});
            } else {
                $icon.css({'transform': 'rotate(0deg)', 'display': 'inline-block', transition: 'all 0.3s ease'});
            }
        });
    });
}

accordion();
