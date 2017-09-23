var VideoQuiz = (function() {
	var VideoQuiz = function() {
		this.video = document.getElementById('video');
		this.prevTime = 0;
		this.nextTime = 0;
		this.curTimeIdx = 0;
		this.question = {};
		this.timestamps = [];
		this.questionIdx = 0;
		this.questions = [];
		this.init();
	};

	VideoQuiz.prototype.constructor = VideoQuiz;

	VideoQuiz.prototype.init = function() {
		var self = this;

		function _init(data) {
			console.log(data);
			self.timestamps = data.timestamps;
			self.questions = data.questions;

			self.question = self.questions[self.questionIdx];
			self.nextTime = self.timestamps[self.curTimeIdx];

			self.video.addEventListener('timeupdate', function(event) {
				var _video = event.target;
				console.log(Math.floor(_video.currentTime), self.nextTime);
				if (Math.floor(_video.currentTime) == self.nextTime) {
					_video.pause();

					self.addQuestionsToDom();

					$('#submit').unbind('click').click(function(event) {
						event.preventDefault();
						var result = $('input[type="radio"]:checked').val() == 'true';
						if (result) {
							self.prevTime = self.nextTime;

							self.curTimeIdx++;
							self.questionIdx++;

							self.nextTime = self.timestamps[self.curTimeIdx];
							self.question = self.questions[self.questionIdx];
						} else {
							_video.currentTime = self.prevTime;
						}

						$('.question-container').addClass('hidden');
						_video.play();
					});
				}
			});
		}

		$.get('data.json', _init);
	};

	VideoQuiz.prototype.addQuestionsToDom = function() {
		var self = this; 

		$('.title').text(self.question.text);

		$('#questions').empty();

		$.each(self.question.answers, function(index, value) {
			var li = $('<li></li>');

			var radio = $('<input/>').attr({
				type: 'radio',
				id: 'answer' + index,
				name: 'answer'
			}).val(value.val);

			li.append(radio);

			var label = $('<label></label>').attr({
				for: 'answer' + index
			}).text(value.text);

			li.append(label);

			$('#questions').append(li);
		});

		$('.question-container').removeClass('hidden');
	}

	return VideoQuiz;

})();

var videoQuiz = new VideoQuiz();

