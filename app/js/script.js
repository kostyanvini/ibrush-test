import Swiper, {Pagination} from "swiper";
import customSelect from "custom-select/src";
import 'simplebar';

Swiper.use([Pagination]);


document.addEventListener('DOMContentLoaded', function () {
	new Swiper('.swiper.posts-list', {
		spaceBetween: 30,
		breakpoints: {
			0: {
				slidesPerView: 1,
				pagination: {
					el: '.posts-list-pagination',
				},
			},
			768: {
				slidesPerView: 3,
				pagination: false
			}
		}
	});
	customSelect('select');

	const inputs = document.querySelectorAll('[data-input-label]');
	if (inputs.length) {
		inputs.forEach(input => {
			input.addEventListener('input', function () {
				this.value !== '' ? this.classList.add('_not-empty') : this.classList.remove('_not-empty');
			})
		})
	}
});