document.querySelectorAll("code").forEach(el => {
  el.addEventListener("click", e =>{
    console.log(e.target);
  });
});