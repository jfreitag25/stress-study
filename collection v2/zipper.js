// Create a new zip file object
const zip = new JSZip();

// Required CSS and JS files
const req_js = ['bootstrap.min.js', 'jQuery_local.js', 'jquery-1.10.2.min.js', 'jszip.min.js']
const req_css = ['all.min.css', 'bootstrap.min.css', 'sb-admin-2_min.css', 'styles.css', 'changed.css']

// Loop through each file and add it to the zip file
req_js.forEach(function (fileName) {
    fetch(`gen_extension/base_js/${fileName}`)
    .then(response => {
        zip.folder('base_js').file(fileName, response.blob())
    })
})

req_css.forEach(function (fileName) {
    fetch(`gen_extension/base_css/${fileName}`)
    .then(response => {
        zip.folder('base_css').file(fileName, response.blob())
    })
})


// ID File
fetch("gen_extension/ID.js")
.then(response => {
    zip.file("ID.js", response.blob())
})


function generate_manifest(name, version, description, regex_extension_links, regex_ID_links, regex_timer_links){
    return `
    {
      "manifest_version": 2,
      "name": "${name}",
      "version": "${version}",
      "description": "${description}",
      "permissions": [
        "activeTab",
        "storage"
      ],
      "content_scripts": [
        {
          "matches": [${regex_extension_links}],
          "js": ["script.js", "base_js/jQuery_local.js", "base_js/bootstrap.min.js", "base_js/jquery-1.10.2.min.js"],
          "css": ["base_css/styles.css", "base_css/sb-admin-2_min.css", "base_css/all.min.css", "base_css/changed.css", "base_css/bootstrap.min.css"],
          "run_at": "document_end"
        },

        {
          "matches": [${regex_ID_links}],
          "js": ["ID.js"],
          "css": ["base_css/styles.css", "base_css/sb-admin-2_min.css", "base_css/all.min.css", "base_css/changed.css"],
          "run_at": "document_end"
        },
        {
          "matches": [${regex_timer_links}],
          "js": ["timer.js"],
          "css": ["base_css/styles.css", "base_css/sb-admin-2_min.css", "base_css/all.min.css", "base_css/changed.css"],
          "run_at": "document_end"
        }
      ]
    }
    `
}

function generate_timer(startTime, endTime, Input){
  return `
  let startTime = new Date();
  startTime.setHours(${startTime});
  let endTime = new Date();
  endTime.setHours(${endTime});
  let time = new Date()
  
  
  function setSleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
   }
  
  
   async function check() {
    while(time < endTime && time > startTime){
      chrome.storage.sync.get('prompted', function (obj2) {
          if (!obj2.prompted){
              document.getElementById('myForm').hidden = true
              document.getElementById('prompt').hidden = true
          }
            // if(time.getMinutes() % 30 == 0){
                if(${Input}.includes(time.getHours() + ":" + ("0" + time.getMinutes()).slice(-2))){
    
              document.getElementById('myForm').hidden = false
              document.getElementById('prompt').hidden = false
              chrome.storage.sync.set({'prompted': true}, function() {console.log('Prompted')});
          }
          time = new Date()
      })
        
      await setSleep(60 * 1000)
    }
 }
  
  window.addEventListener('load', function() {
      check()
  })
  `
}

function generate_extension(data_sheet_link, title, icon, Q1, Q2, Q1_0_lab, Q1_5_lab, Q2_0_lab, Q2_5_lab, IDLink){
  return `
  let biggestDiv = document.createElement('div')
  biggestDiv.id = 'wrapper'
  biggestDiv.style = 'position: fixed; top: 80%; left: 70%; border-radius: 40px; text-align: center; z-index: 11;'
  
  let outerDiv = document.createElement('div')
  outerDiv.id = 'bottom'
  outerDiv.style = 'max-width: 300px; height: auto'
  
  let talkDiv = document.createElement('div')
  talkDiv.className = "chat-popup"
  talkDiv.id = "myForm"
  talkDiv.hidden = true
  talkDiv.style = 'background-color:#FCF5E5; margin-bottom:2em; margin-right: 2em; display:flex; justify-content: center; width: auto'
  
  let outerForm = document.createElement('form')
  outerForm.id = 'my-form'
  outerForm.method = 'POST'
  outerForm.action = '${data_sheet_link}'
  
  let formText = document.createElement('div')
  formText.className = "talktext"
  
  let titleDiv = document.createElement('div')
  titleDiv.id = 'title'
  titleDiv.style = 'margin-bottom:0.5em'
  let innerTitle = document.createElement('p')
  innerTitle.style = 'font-weight:bold;text-align:center'
  innerTitle.innerText = "${title}"
  titleDiv.appendChild(innerTitle)
  
  let promptDiv = document.createElement('div')
  promptDiv.id = 'prompt'
  promptDiv.style = 'margin-bottom:0.5em'
  promptDiv.hidden = true
  
  let innerPrompt = document.createElement('p')
  innerPrompt.style = 'text-align:center; color:green'
  innerPrompt.innerText = 'Please Submit a Response!'
  
  promptDiv.appendChild(innerPrompt)
  
  let margin = document.createElement('div')
  margin.style = "margin:2em"
  
  let margin2 = document.createElement('div')
  margin2.style = "margin:1em"
  
  let margin3 = document.createElement('div')
  margin3.style = "margin:2em"
  
  let q2 = document.createElement('div')
  q2.className = 'form-wrapper'
  
  let p2 = document.createElement('p')
  p2.style="text-align:center"
  p2.innerText = "${Q1}"
  
  function radioGen(names, uid, extrema, labs, labels = ['0', '1', '2', '3', '4', '5']) {
      let innerFormDiv = document.createElement('div')
      innerFormDiv.style = "display: flex; justify-content: center;"
  
      let second_form = document.createElement('form')
      second_form.className = "rating-form"
  
      elts = []
      for(let i = 0; i < 6; i++){
          let ltemp = document.createElement('label')
          ltemp.setAttribute('for', labels[i] + uid)
          let rad1 = document.createElement('input')
          rad1.type = 'radio'
          rad1.name = names
          rad1.className = labels[i]
          rad1.id = labels[i] + uid
          rad1.value = labels[i]
          if (i == 0){
              rad1.setAttribute('data-toggle', 'tooltip')
              rad1.setAttribute('title', extrema[0])
          }
          if (i == 5){
              rad1.setAttribute('data-toggle', 'tooltip')
              rad1.setAttribute('title', extrema[1])
          }
          let wrapDiv1 = document.createElement('div')
          wrapDiv1.style = "display:flex; justify-content:center;margin-top:0.5em;margin-bottom:0.5em;margin-left:0.5em;margin-right:0.5em"
          wrapDiv1.appendChild(rad1)
          ltemp.appendChild(wrapDiv1)
          ltemp.appendChild(labs[i])
  
          elts.push(ltemp)
      }
  
      for(let i = 0; i < elts.length; i++){
          innerFormDiv.appendChild(elts[i])
      }
  
      return innerFormDiv
  }
  
  
  
  let subBtnDiv = document.createElement('div')
  subBtnDiv.style = 'display:flex; justify-content: center'
  
  let subBtn = document.createElement('button')
  subBtn.type = 'submit'
  subBtn.id = 'subBtn'
  subBtn.innerHTML = '<b>Enter</b>'
  
  let fltBtn = document.createElement('button')
  fltBtn.type = 'button'
  fltBtn.className = 'btn btn-floating btn-lg'
  fltBtn.id = 'btn-back-to-top'
  fltBtn.setAttribute('onclick', 'openForm()')
  
  let img = document.createElement('img')
  img.src = '${icon}'
  img.style = 'width:35px; height:35px'
  
  fltBtn.appendChild(img)
  
  let num1 = document.createElement('p')
  num1.style = 'text-align:center;margin-left:0.5em;margin-right:0.5em'
  num1.innerText = '0'
      
  let num2 = document.createElement('p')
  num2.style = 'text-align:center;margin-left:0.5em;margin-right:0.5em'
  num2.innerText = '1'
  
  let num3 = document.createElement('p')
  num3.style = 'text-align:center;margin-left:0.5em;margin-right:0.5em'
  num3.innerText = '2'
  
  let num4 = document.createElement('p')
  num4.style = 'text-align:center;margin-left:0.5em;margin-right:0.5em'
  num4.innerText = '3'
  
  let num5 = document.createElement('p')
  num5.style = 'text-align:center;margin-left:0.5em;margin-right:0.5em'
  num5.innerText = '4'
  
  let num6 = document.createElement('p')
  num6.style = 'text-align:center;margin-left:0.5em;margin-right:0.5em'
  num6.innerText = '5'
  
  let innerFormDiv = radioGen('rating', '', ["${Q1_0_lab}", "${Q1_5_lab}"], [num1, num2, num3, num4, num5, num6])
  
  let q3 = document.createElement('div')
  q3.className = 'form-wrapper'
  
  let p3 = document.createElement('p')
  p3.innerText = "${Q2}"
  p3.style="text-align:center"
  
  q2.appendChild(p2)
  q2.appendChild(innerFormDiv)
  
  let num11 = document.createElement('p')
  num11.style = 'text-align:center;margin-left:0.5em;margin-right:0.5em'
  num11.innerText = '0'
      
  let num21 = document.createElement('p')
  num21.style = 'text-align:center;margin-left:0.5em;margin-right:0.5em'
  num21.innerText = '1'
  
  let num31 = document.createElement('p')
  num31.style = 'text-align:center;margin-left:0.5em;margin-right:0.5em'
  num31.innerText = '2'
  
  let num41 = document.createElement('p')
  num41.style = 'text-align:center;margin-left:0.5em;margin-right:0.5em'
  num41.innerText = '3'
  
  let num51 = document.createElement('p')
  num51.style = 'text-align:center;margin-left:0.5em;margin-right:0.5em'
  num51.innerText = '4'
  
  let num61 = document.createElement('p')
  num61.style = 'text-align:center;margin-left:0.5em;margin-right:0.5em'
  num61.innerText = '5'
  
  let innerFormDiv2 = radioGen('rating1', '1', ["${Q2_0_lab}", "${Q2_5_lab}"], [num11, num21, num31, num41, num51, num61])
  
  q3.appendChild(p3)
  q3.appendChild(innerFormDiv2)
  
  subBtnDiv.appendChild(subBtn)
  
  formText.appendChild(titleDiv)
  formText.appendChild(promptDiv)
  formText.appendChild(q2)
  formText.appendChild(margin3)
  formText.appendChild(q3)
  formText.appendChild(margin2)
  formText.appendChild(subBtnDiv)
  
  let FAQDiv = document.createElement('div')
  FAQDiv.style = 'display:flex; text-align: center; margin-top:0.5em'
  FAQDiv.className = 'form-wrapper'
  FAQDiv.id = 'FAQDiv'
  
  let FAQTxt = document.createElement('p')
  FAQTxt.innerHTML = 'Need help? Visit our <a href="https://jfreitag25.github.io/stress-study/faq-student.html">FAQ</a> page!'
  
  FAQDiv.appendChild(FAQTxt)
  formText.appendChild(FAQDiv)

  let errDiv = document.createElement('div')
  errDiv.style = 'display:flex; text-align: center; margin-top:0.5em'
  errDiv.hidden = true
  errDiv.id = 'errDiv'
  
  let errTxt = document.createElement('p')
  errTxt.innerHTML = 'There is no participant ID saved. Please <a href="${IDLink}">log in</a> and refresh the page!'
  errTxt.style = 'color:red'
  
  errDiv.appendChild(errTxt)
  formText.appendChild(errDiv)
  
  
  outerForm.appendChild(formText)
  
  talkDiv.appendChild(outerForm)
  
  outerDiv.appendChild(talkDiv)
  
  biggestDiv.appendChild(outerDiv)
  
  biggestDiv.appendChild(fltBtn)
  
  document.body.appendChild(biggestDiv)
  
  
  let styLink = document.createElement('link')
  styLink.setAttribute('rel', 'stylesheet')
  styLink.setAttribute('href', "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css")
  
  let popperScrpt = document.createElement('script')
  popperScrpt.src = 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js'
  document.head.appendChild(popperScrpt)
  
  let jQScript = document.createElement('script')
  jQScript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js'
  document.head.appendChild(jQScript)
  
  let bootScript = document.createElement('script')
  bootScript.src = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js'
  document.head.appendChild(bootScript)
  
  let toolScript = document.createElement('script')
  toolScript.innerHTML = "$(document).ready(function(){ $('[data-toggle='tooltip']').tooltip(); });"
  document.body.appendChild(toolScript)
  
  function openForm() {
      document.getElementById("myForm").style.hidden = false;
  }
  
  function closeForm() {
      document.getElementById("myForm").style.hidden = true;
  }
  
  function toggle() {
      document.getElementById('myForm').hidden = !document.getElementById('myForm').hidden 
  }
  
  
  document.onkeydown = function(evt) {
      evt = evt || window.event;
      if (evt.keyCode == 27) {
          document.getElementById('myForm').hidden = true
      }
      if (evt.keyCode == 18) {
        document.getElementById('subBtn').click()
      }
  };

  function getData() {
      chrome.storage.sync.get('stress_analyt', function (obj) {
          console.log(obj)
          if (obj.stress_analyt == undefined){
              document.getElementById('subBtn').disabled = true
              document.getElementById('errDiv').hidden = false
          } else {
              document.getElementById('subBtn').disabled = false
              document.getElementById('errDiv').hidden = true
          }
      }); 
  }
  
  window.addEventListener('load', function() {
      
      getData()
  
          let mybutton = document.getElementById("btn-back-to-top");
          let ratings = document.getElementsByName('rating');
          let rating1 = document.getElementsByName('rating1');
  
          mybutton.addEventListener("click", toggle);
  
  
          const form = document.getElementById('my-form');
          form.addEventListener("submit", function(e) {
              e.preventDefault();
              let myID
              document.getElementById('subBtn').disabled = true
              let val, ind;
              for (let i = 0; i < ratings.length; i++){
                  if (ratings[i].checked) {
                      val = ratings[i].value
                      ind = i
                      break
                  }
              }
              let val1, ind1;
              for (let i = 0; i < rating1.length; i++){
                  if (rating1[i].checked) {
                      val1 = rating1[i].value
                      ind1 = i
                      break
                  }
              }
              chrome.storage.sync.get('stress_analyt', function (obj) {
                  try {
                      myID = obj.stress_analyt.ID
                      if(myID == undefined){
                          throw "exit"
                      }
                      const data = new FormData(form);
                      data.append('${Q1}', val)
                      data.append('${Q2}', val1)
                      data.append('ID', myID)
                      data.append('URL', window.location.href)
                      data.append('Title', document.title)
                      data.append('Scroll_X_Position', window.scrollX)
                      data.append('Scroll_Y_Position', window.scrollY)
                      chrome.storage.sync.get('prompted', function (obj2) {
                          console.log(obj2.prompted)
                          data.append('Prompted', obj2.prompted ? 'Prompted' : 'Self-Report')
                          chrome.storage.sync.set({'prompted': false}, function() {console.log('Prompted')});
                          const action = e.target.action;
                          fetch(action, {
                              method: 'POST',
                              body: data,
                          })
                          .then(() => {
                              document.getElementById('prompt').hidden = true
                              document.getElementById('subBtn').disabled = false
                              setTimeout(() => {document.getElementById('myForm').hidden = true}, 1000)
                              ratings[ind].checked = false
                              rating1[ind1].checked = false
                          })
  
  
                      })
                      
                  } catch (error) {
                      document.getElementById('errDiv').hidden = false
                      document.getElementById('subBtn').disabled = true
                  }
                  
  
  
              })
              
          });
  
          $(function () {
              $('[data-toggle="tooltip"]').tooltip()
            })
      })
  
  `
}


let clean = function (str) {
    let temp = ''
    for(char in str){
        if(str[char] == "'"){
            temp += "\'"
        } else if (str[char] == '"') {
            temp += '\"'
        } else if (str[char] == '`'){
            temp += '\`'
        } else {
            temp += str[char]
        }
    }
    return temp
}

let ids = ['title', 'vnum', 'descript', 'extRegex', 'idRegex', 'timerRegex', 'macro', 'ftitle', 'icon', 'Q1', 'Q2', 'Q1L0', 'Q1L5', 'Q2L0', 'Q2L5', 'idlink', 'start', 'end', 'freq']

window.addEventListener('load', function() {
	let subbtn = document.getElementById('subbtn')
	subbtn.addEventListener('click', () => {
		subbtn.disabled = true
		try {
			for(let i = 0; i < ids.length; i++){
				if(document.getElementById(ids[i]).value == ''){
					throw Error
				}
			}
			const manifestContent = generate_manifest(clean(document.getElementById(ids[0]).value), 
                clean(document.getElementById(ids[1]).value), 
                clean(document.getElementById(ids[2]).value),
                clean(document.getElementById(ids[3]).value),
                clean(document.getElementById(ids[4]).value),
                clean(document.getElementById(ids[5]).value))
			const extensionContent = generate_extension(
                clean(document.getElementById(ids[6]).value),
                clean(document.getElementById(ids[7]).value),
                clean(document.getElementById(ids[8]).value),
                clean(document.getElementById(ids[9]).value),
                clean(document.getElementById(ids[10]).value),
                clean(document.getElementById(ids[11]).value),
                clean(document.getElementById(ids[12]).value),
                clean(document.getElementById(ids[13]).value),
                clean(document.getElementById(ids[14]).value),
                clean(document.getElementById(ids[15]).value))
			const timerContent = generate_timer(
                clean(document.getElementById(ids[16]).value),
                clean(document.getElementById(ids[17]).value),
                clean(document.getElementById(ids[18]).value))

			// const manifestContent = generate_manifest("Generated Extension", "2.0", "This is the generated extension", '"https://*/*", "http://*/*"', '"https://jfreitag25.github.io/stress-study/*", "https://jfreitag25.github.io/*"', '"https://canvas.instructure.com/*", "https://canvas.instructure.com/", "https://jupyterhub.uclatall.com/*", "https://jupyterhub.uclatall.com/"')
			// const extensionContent = generate_extension("https://script.google.com/macros/s/AKfycbxqfX-aFHBWO7N2EIMhwKbtWeezvxwblDk5ltHRFWiREQR3mMncFDGXz57bcHe-t1I/exec", "Heres our extension!", "https://i.postimg.cc/qv7dKJdY/image-6.png", "How serious is it?", "How sure do you feel you can work it out?", "Very slight", "Very severe", "I'm sure I can figure this out", "I'm close to Giving Up", "https://jfreitag25.github.io/stress-study/login-student.html")
			// const timerContent = generate_timer('16,30,0', '19,30,0', '30')
			
			const manifestblob = new Blob([manifestContent], { type: 'application/json' });
			const extensionblob = new Blob([extensionContent], { type: 'text/javascript' });
			const timerblob = new Blob([timerContent], { type: 'text/javascript' });
		
			zip.file("manifest.json", manifestblob)
			zip.file("script.js", extensionblob)
			zip.file("timer.js", timerblob)

			zip.generateAsync({ type: "blob" }) 
			.then(function (blob) {
				const link = document.createElement('a');
				link.href = window.URL.createObjectURL(blob);
				link.download = 'extension.zip';
		
				document.body.appendChild(link); 
				link.click();
				document.body.removeChild(link);
			});    
			subbtn.disabled = false
		} catch (error) {
			document.getElementById('errTxt').hidden = false
			subbtn.disabled = false
		}
		
	})


})
