const modal = document.getElementById('info-modal')
const btn = document.getElementById('open-modal-btn')
const span = document.getElementsByClassName('close-modal-btn')[0]

btn.onclick = () => {
  modal.style.display = 'block'
}

span.onclick = () => {
  modal.style.display = 'none'
}

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = 'none'
  }
}