window.CP = window.CP || {
  shouldStopExecution:()=>0,
  exitedLoop:()=>0,
}

function create(type) {
  return document.createElementNS("http://www.w3.org/2000/svg", type);
}

const goldenRatio = (1 + 5 ** .5) / 2
const offset = 0 // Math.random()
const branchsInput = document.querySelector("#branchs");
const svg = create("svg");
document.body.appendChild(svg);

const stars = create("g");
stars.id = "stars";

svg.append(stars);
let size = 100
const gcd = (a, b) => b ? gcd(b, a % b) : a

function xy(angle = 0){
  angle *= Math.PI * 2
  return [Math.sin(angle) * size, -Math.cos(angle) * size]
}

function resize() {
  const w = window.innerWidth
  const h = window.innerHeight
  const min = Math.min(w,h)
  size = min / 2 * 0.75
  draw()
}

function draw() {
  const frag = document.createDocumentFragment()
  const text = document.createDocumentFragment()
  const branchs = branchsInput.valueAsNumber;
  text.append(branchs, ': ')
  for (let step = 1; step <= branchs/2; step++) {
    const star = create('g')
    const hue = offset + step * goldenRatio
    const coprime = step > 1 && gcd(step, branchs) === 1
    const lum = coprime ? 0.6 : 0.3
    const color = `oklch(${lum} 0.2 ${hue}turn)`
    star.setAttribute('stroke', color)
    star.setAttribute('stroke-width', coprime ? 2 : 1)
    const span = document.createElement("span")
    span.append(step)
    span.style.setProperty('--color', color)
    span.star = star
    if(coprime) span.classList.add('coprime')
    text.append(span)
    for (let branch = 0; branch < branchs; branch++){
      if(branch >= branchs / 2 && step === branchs / 2) break
      const line = create('line')
      ;[x1, y1] = xy(branch / branchs)
      ;[x2, y2] = xy((branch + step) / branchs)
      line.setAttribute('x1', x1)
      line.setAttribute('y1', y1)
      line.setAttribute('x2', x2)
      line.setAttribute('y2', y2)
      star.appendChild(line)
    }
    frag.appendChild(star)
  }
  stars.replaceChildren(frag)
  pre.replaceChildren(text)
}
resize();

window.addEventListener('resize', resize)

branchsInput.addEventListener('input', draw)

pre.addEventListener('mouseover', ({target}) => {
  const star = target.star
  if(!star) return
  star.classList.add('hl')
})

pre.addEventListener('mouseout', ({target}) => {
  const star = target.star
  if(!star) return
  star.classList.remove('hl')
})
