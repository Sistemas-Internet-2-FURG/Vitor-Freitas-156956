const changeStyle = ()=>{
    const tag = document.getElementsByClassName("title-text")
    tag[0].style.color = "red"
    tag[0].innerHTML = "Inter maior do sul."
    tag[0].style.fontSize = "4rem"
    setTimeout(() => {
        tag[0].style.color = "white"
    tag[0].innerHTML = "Clique para ver uma verdade."
    tag[0].style.fontSize = "2rem"
    }, 2000);
    return
}