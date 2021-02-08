import React, { useState, useEffect } from 'react'
import html2canvas from 'html2canvas';
import './styles/style.scss'


const App = () => {
  const [shakespeare, shakespeareCreate] = useState([])
  const [dickinson, dickinsonCreate] = useState([])
  const [byron, byronCreate] = useState([])
  const [wilde, wildeCreate] = useState([])
  const [randomLove, randomLoveCreate] = useState([])
  const [poemLines, updatePoemLines] = useState([])
  const [background, updateBackground] = useState('http://media.vam.ac.uk/media/thira/collection_images/2008BT/2008BT5843.jpg')
  const [script, updateScript] = useState(255, 215, 0)
  const [scriptBack, updateScriptBack] = useState(220, 20, 60)
  const [styleSelector, updateStyleSelector] = useState('dickinson')
  const [modal, modalUpdate] = useState('false')
  const [search, updateSearch] = useState('lilies')
  const [linecount, updateLinecount] = useState('3')


  function fetchCanvas(search) {
    const searchTerm = search.replaceAll(' ', '-')
    fetch(`https://www.vam.ac.uk/api/json/museumobject/search?q=${searchTerm}&images=1&limit=45`)
      // https://cors-anywhere.herokuapp.com/
      .then(resp => resp.json())
      .then(data => {
        const imager = data.records[Math.floor(Math.random() * 45)].fields.primary_image_id
        const imagerTag = imager.slice(0, 6)
        updateBackground(`http://media.vam.ac.uk/media/thira/collection_images/${imagerTag}/${imager}.jpg`)

      })
    // 
  }

  useEffect(() => {
    const shakespeareArr = []
    fetch('https://poetrydb.org/author,linecount/Shakespeare;14/lines')
      .then(resp => resp.json())
      .then(data => {
        data.map((poem, index) => {
          return shakespeareArr.push(poem.lines)
        })
      })

    shakespeareCreate(shakespeareArr)

  }, [])

  useEffect(() => {
    const emilyArr = []
    fetch('https://poetrydb.org/author/Emily Dickinson')
      .then(resp => resp.json())
      .then(data => {
        data.map((poem) => {
          return emilyArr.push(poem.lines)
        })
      })
    dickinsonCreate(emilyArr)
  }, [])

  useEffect(() => {
    const wildeArr = []
    fetch('https://poetrydb.org/author/Oscar Wilde')
      .then(resp => resp.json())
      .then(data => {
        data.map((poem) => {
          return wildeArr.push(poem.lines)
        })
      })
    wildeCreate(wildeArr)
  }, [])

  useEffect(() => {
    const randomLoveArr = []
    fetch('https://poetrydb.org/title,random/love;100')
      .then(resp => resp.json())
      .then(data => {
        data.map((poem) => {
          return randomLoveArr.push(poem.lines)
        })
      })
    randomLoveCreate(randomLoveArr)
  }, [])

  useEffect(() => {
    const byronArr = []
    fetch('https://poetrydb.org/author,poemcount/Byron;50')
      .then(resp => resp.json())
      .then(data => {
        data.map((poem) => {
          return byronArr.push(poem.lines)
        })
      })
    byronCreate(byronArr)
  }, [])



  function randomPoemGen() {
    const poemArray = []
    const poetLine = linecount
    const poetChoice = styleSelector
    const randomPoem = poetChoice[Math.floor(Math.random() * poetChoice.length)]
    const randomLine = randomPoem[Math.floor(Math.random() * randomPoem.length)]

    for (let index = 0; index < poetLine; index++) {
      const randomPoem = poetChoice[Math.floor(Math.random() * poetChoice.length)]
      let randomLine = randomPoem[Math.floor(Math.random() * randomPoem.length)]
      randomLine = randomLine.charAt(0).toUpperCase() + randomLine.slice(1)
      if (randomLine.length > 20) {
        if (index === poetLine - 1) {
          if (randomLine.trim().split('')[randomLine.length - 1] === ',' || randomLine.trim().split('')[randomLine.length - 1] === ';' || randomLine.trim().split('')[randomLine.length - 1] === ':') {
            randomLine = randomLine.slice(0, -1) + '.'
            poemArray.push(randomLine)
          } else { poemArray.push(randomLine) }

        } else {
          poemArray.push(randomLine)
        }
      } else { index-- }
    }
    console.log(poemArray)
    updatePoemLines(poemArray)
  }


  //random font colour generator 
  function fontCol() {
    const red = Math.ceil(Math.random() * 255)
    const blue = Math.ceil(Math.random() * 255)
    const green = Math.ceil(Math.random() * 255)
    const randomCol = red + "," + blue + "," + green
    const randomCol1 = blue + "," + green + "," + red
    updateScript(randomCol)
    updateScriptBack(randomCol1)
  }
  //update poet input
  function poetSelector(input) {
    if (input === 'Shakespeare') {
      updateStyleSelector(shakespeare)
    } else if (input === 'Wilde') {
      updateStyleSelector(wilde)
    } else if (input === 'Byron') {
      updateStyleSelector(byron)
    } else if (input === 'Emily Dickinson') {
      updateStyleSelector(dickinson)
    } else if (input === 'Random Love Poem') {
      updateStyleSelector(randomLove)
    }
  }

  ///html2canvas
  function canvasMaker() {
    html2canvas(document.getElementById('unblur'), { allowTaint: true, useCORS: true }).then(function (canvas) {
      const link = document.createElement("a");
      document.body.appendChild(link);
      link.download = "code_poem.png";
      link.href = canvas.toDataURL("image/png");
      link.target = '_blank';
      link.click();
    });
  }
  ////
  return (
    <div>
      <div className='superContainer'>
        <div className='modal' id={modal ? "hidden" : "visible"}>
          <h3>About</h3>
          <p>Code Poetry was a short, solo project that used React, AJAX, and REST APIs to generate random poetry set against random artwork.</p>
          <p>The words were provided by the <a target="_blank" href="https://github.com/thundercomb/poetrydb/blob/master/README.md">PoetryDB</a> API.</p>
          <p>Images were drawn from the <a target="_blank" href="https://www.vam.ac.uk/api">Victoria and Albert Museum's API.</a></p>
          <p>The download function was made possible by the <a target="_blank" href='https://html2canvas.hertzen.com/'>HTML2Canvas package.</a></p>
        </div>

        <div className='container' id={modal ? "unblur" : "blur"} style={{
          backgroundImage: `url('${background}')`
        }} >
          {poemLines.map((line, index) => {
            return <div key='line' className='script' style={{ color: `RGB(${script})`, backgroundColor: `RGB(${scriptBack})` }}><a>{line}</a></div>
          })}
        </div>
        <div className='buttons'>
          <div className='buttonBox'>
            <select onChange={(event) => poetSelector(event.target.value)}>
              <option>Choose Poet</option>
              <option>Shakespeare</option>
              <option>Emily Dickinson</option>
              <option>Random Love Poem</option>
              <option>Wilde</option>
              <option>Byron</option>
            </select>
          </div>
          <div className='buttonBox'>
            <select onChange={(event) => updateLinecount(event.target.value)}>
              <option>Choose Poem Length</option>
              <option>3</option>
              <option>5</option>
              <option>8</option>
              <option>10</option>
              <option>14</option>
            </select>

          </div>
          <div className='buttonBox'>
            <button onClick={() => randomPoemGen()}>Create Poem</button>
          </div>
          <div className='buttonBox' >
            <input type='text' placeholder='Choose background e.g. lilies' onKeyUp={(event) => updateSearch(event.target.value)} />
            <button onClick={() => modalUpdate(modal ? false : true)} id='about'>About</button>
          </div>
          <div className='buttonBox'>
            <button onClick={() => fetchCanvas(search)}>Change Background</button>
          </div>
          <div className='buttonBox'><button onClick={() => fontCol()}>Change Font Colour</button></div>


          <div className='buttonBox'><button onClick={() => canvasMaker()}>Download Your Card</button></div>

        </div>
      </div>
    </div >)

}

export default App


