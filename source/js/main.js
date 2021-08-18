const menu = document.querySelector('.main-navigation');
const menuButton = menu.querySelector('.main-navigation__button');
const form = document.querySelector('.form');
const orderButton = document.querySelectorAll('.order');
const modal = document.querySelector('.modal-order');
const modalOrderCloseButton = modal.querySelector('.modal-order__button');
const modalMessage = document.querySelector('.modal-message');
const modalMessageCloseButton = modalMessage.querySelector('.modal-message__button');


menu.classList.remove('main-navigation--nojs');

const onMenuButtonClick = () => {
  menu.classList.toggle('main-navigation--closed');
  menu.classList.toggle('main-navigation--opened');
  let ariaLabelAttribute = (menu.classList.contains("main-navigation--opened")) ? "Закрыть меню" : "Открыть меню";
  menuButton.setAttribute("aria-label", ariaLabelAttribute);
}

menuButton.addEventListener('click', onMenuButtonClick);

const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const closeModal = () => modal.classList.add('modal-order--hidden');

const onModalKeydown = (evt) => {
  if (isEscEvent(evt)) {
    evt.preventDefault();
    closeModal();
  }
};

const onModalCloseButtonClick = () => closeModal();

const closeModalMessage = () => modalMessage.classList.add('modal-message--hidden');

const onModalMessageKeydown = (evt) => {
  if (isEscEvent(evt)) {
    evt.preventDefault();
    closeModalMessage();
  }
};

const onModalMessageCloseButtonClick = () => closeModalMessage();

const showModalWindowOrder = () => {
  orderButton.forEach((elem) => {
    elem.addEventListener('click', (evt) => {
      evt.preventDefault();
      modal.classList.remove('modal-order--hidden');
      modalCloseButton.addEventListener('click', onModalCloseButtonClick);
      document.addEventListener('keydown', onModalKeydown);
    })
  })
};

showModalWindowOrder();

form.addEventListener('submit', () => {
  evt.preventDefault();
  modalMessage.classList.add('modal-message--hidden');
  modalMessageCloseButton.addEventListener('click', onModalMessageCloseButtonClick);
  document.addEventListener('keydown', onModalMessageKeydown);
});
