// ==UserScript==
// @name         LearConnect RDP list Tamper
// @namespace    http://keyland.es/
// @version      0.3.1
// @description  Remove or correct items in RDP server list
// @author       Enrique Gómez
// @match        https://learconnect.lear.com/dana/home/index.cgi
// @downloadURL  https://github.com/enriquega-key/learconnect-list-tamper/raw/main/LearConnect%20RDP%20list%20Tamper.user.js
// @updateURL    https://github.com/enriquega-key/learconnect-list-tamper/raw/main/LearConnect%20RDP%20list%20Tamper.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let ipsNamesToRemove = [ "10.48.232.35",
                             //"ACRVMBLD01",
                             "10.48.208.36",
                             "10.48.184.34",
                             "ARAVMBLD02", //obsoleto -> ESBUR-BLD01
                             //"PLTYC-APP02",
                             "10.58.136.32", //JNY?? old
                             "10.58.136.33", //JNY?? old
                             "10.48.42.24",
                             "10.99.64.52",
                             "10.48.192.38",
                             "10.48.192.36",
                             "ALVVMBLD02", //obsoleto -> ESVIT-BLD01
                           ];
    let ipsToTranslate = { //"10.48.42.25": "ARDVMBLD01",
                           //"10.48.202.60": "ESBRL-BLD01",
                           "10.48.202.61": "ESBRL-SQL02",
                           "SADVMBLD01": "ESBRL-BLD01",
                         };
    let notes = { "ARDVMBLD01": '(Ardasa BladePLC) <span style="font-weight:bold;">(SIN SOPORTE)</span>',
                  "ESBRS-SRI01": '(Ardasa Producción) <span style="font-weight:bold;">(SIN SOPORTE)</span>',
                  "ACRVMBLD01": '<span style="font-weight:bold;">(Fuera de soporte)</span>',
                  "PLTYC-APP02": '<span style="font-weight:bold;">(Fuera de soporte)</span>',
                  "PTVLN-BLD02" : '(Sin uso. Servidor de pruebas al inicio del proyecto de Mangualde)', // servidor de pruebas al inicio del proyecto de Mangualde
                  "ESVIT-BLD02": "¿?¿?¿?",
                  "ESBUR-BLD01": "(ARA)",
                  "FRJRN-BLD02": '(Sin uso. No tiene nada de Blade)',
                  //"10.48.202.60": "(SAD/Martorell Servicios BLADE)",
                  "10.48.202.61": "(SAD/Martorell SQL Server BLADE)",
                  "SADVMBLD01": "(SAD/Martorell Servicios BLADE)",
                  //"ESBRL-BLD01": "(SAD/Martorell Servicios BLADE)",
                  //"ESBRL-SQL02": "(SAD/Martorell SQL Server BLADE)",
                  "10.48.202.60": "ESBRL-BLD01. IP antigua. NO USAR",
                };

    let countryFlags = {
        "ES": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjM0MiIgdmlld0JveD0iMCAwIDUxMiAzNDIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI0ZGREE0NCIgZD0iTTAgLjMzMWg1MTJ2MzQxLjMzN0gweiIvPjxwYXRoIGQ9Ik0wIC4zMzFoNTEydjExMy43NzVIMHptMCAyMjcuNTUxaDUxMnYxMTMuNzc1SDB6IiBmaWxsPSIjRDgwMDI3Ii8+PC9nPjwvc3ZnPg==",
        "FR": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oDBAoyMp+D+EkAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAACAUlEQVQ4y+2VsW5TQRBFz519iXDspEOKRAQNHWkoqPgQJIREQ0eJ+AE+JD0d/0BJxRdQgKLEDhZ2UJwYv70Uu7YTyzh8QEZ62qen2bt37tzZB3dRQy9fvz8k7eyBDcKev2UeHfQ42O+u3ZhPBvj4pCT7JuYoz8bN1++Pj34Mes8EZEqSDTmbD8+f8vbNk7XAs6OPXH36DBLkimwjw7f7e1+aELlJwjaByJWBJLShVANOqeSofqnlGnITEaRUJABQrqtBsQE5BCktwDCFvYGUaJIghbAFGKmuef7+r+6oPFHBVg5oIqkyNiCU64qITVqoMq59WQADRNCEIEKAMEuW0n8wjij6egU8RBMhUgpwxuiGcxS3AKco+TayocpJiCaFakVRDpSLj6t8m4CjMnZl6/kBSpVxRLWJsa8NySYpQjhFteZNjRWiUZTmFRtWUEzOt9hNgkhL8epwKOcixengN4NxYre7RaezxfZ2ImeTs0naqAWkWDph3sDiBprJ5Yzh8ILhsCSkFPS623TuNUz/tHWP17AVKHB4vY+XA1qibTOj8YTRLzj7ec5kcrGcSqnoHmI2Omfa7y+nDeNsyJmr2S6NoLRWK2WGF0Bzxq6dx6KdTmknl7Vz13Ya3ObQi1fvDhWdPa1cfrZ5eNDjwf7O+muzfwbHp2vFH7ez8d0faRF/AXulDzLdjMBIAAAAAElFTkSuQmCC",
        "PT": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjM0MiIgdmlld0JveD0iMCAwIDUxMiAzNDIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI0Q4MDAyNyIgZD0iTTAgLjMzN2g1MTJ2MzQxLjMyNkgweiIvPjxwYXRoIGZpbGw9IiM2REE1NDQiIGQ9Ik0xOTYuNjQxLjMzN3YzNDEuMzI2SDBWLjMzN3oiLz48Y2lyY2xlIGZpbGw9IiNGRkRBNDQiIGN4PSIxOTYuNjQxIiBjeT0iMTcxIiByPSI2NCIvPjxwYXRoIGQ9Ik0xNjAuNjM4IDEzOXY0MC4wMDFjMCAxOS44ODIgMTYuMTE4IDM2IDM2IDM2czM2LTE2LjExOCAzNi0zNlYxMzloLTcyeiIgZmlsbD0iI0Q4MDAyNyIvPjxwYXRoIGQ9Ik0xOTYuNjM4IDE5MWMtNi42MTcgMC0xMi01LjM4My0xMi0xMnYtMTZoMjQuMDAxdjE2Yy0uMDAxIDYuNjE2LTUuMzg1IDEyLTEyLjAwMSAxMnoiIGZpbGw9IiNGMEYwRjAiLz48L2c+PC9zdmc+",
        "SK": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9kBCg4nHRhl3SUAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAACX0lEQVQ4y+2V3UsUYRTGf+d9353cD3bVm3TJvjBCUFAwRIJuoojqMiToqi6C/hAhuqsuIvA6yP8gCLoKyQ/oSgLXpChXw691lVl3Z+Z0sbPrapAEducDw5yZeXnO8z5zznnhBDFkfHy8P5fLZQE9Ls5SqbRNoVCY1mNGoVCYNkD0H5yITCNS/bsTR30/DGet1I0RAd9ndeINGoakBvvZW/hK5PtkrgyRHh3+B1LBfZhbJbvkoSh5f43Mywm8fBeZkSHKH6fZnZpl5dYKC9U8US1o/uHWDagC0nghlNdXcM/fLrBcXiVS5cHFKo89R+72dbyzPXTeu0vlS4HFxTWePJul4ldB6+WjqujhOL562rdxSc+QSTlUFeuBWIfraEeDAA0jvDNdmMiRNo6ERE2lUZ0xJm5NJKTaHM4awRpBFZa9DowVFp++IpHupvLiNemtNXZujFH7HmKNia1QJKpvu0najMGI4ELrCKwHKFPLyuc7D3kxF1Gc3KXz9H1Gun+xkRwgtBXCWK4qqGlVe1BxYB1urDRDsqyAEkYK1TTnLl9j/WdA4GW5ecFn6f0kVxO2YWhddUwE8T3OoCjVWgLX922W/GYZl05hU0mkkmCgVmTq/Ci9m0t0vZuhTxVqDWlxTcfqRbX5rKoISrEth6tWquxulNCNUn2hsyR+FBmen8cmU0SnEiCC7pfDfq21kDaSSqSExuH+6LAgpLq1zR4NAkGcRYxBrEHEIMY0SrYlAaARhBG+BDjAxK3XMp9AkAMdoGGIhuHRo62+1rhPg72PMoOXsnpMY1NAdtDtkxOpid/jNaMFcF1HMwAAAABJRU5ErkJggg==",
        "PL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9kBCg4oC2spdLsAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABx0lEQVQ4y+2VQY7TQBREX313IMlAsmGBhJQdYsOWC3EDbsCsOBoSA5fIdqQoyQBKAHexaLvtZCKhYT29ccfuqvq/6tuBx9Utfby+frtcLhfYvv/YDyeUtNvt9/r29ebLarV6d5EXKLf9EGLW6/VN2ORC6osEkpEE6ERswJwXYmxyQqAQuR2Iul292iCN90Us56GbIj6sJECGCDACCzCDA2bA6EQgYtiDO9FyOFFNEHJRMerq9Qh42k0v1nfQd9i7lurBUXjqCVXEFL7YjU66oe4FJM2nNM/nZPssi6Hu6rguDOLZ1EhCsylp9+ETt5sfNWVnDwDnAWjw+Hc954Lt8DJsXyxKxfqtCg5y9ZTs0rgLoJL0QgA5E1UAZKOrGUkSSoG6B7j47X6Gz6pSR6icEeBRirIhZxRBOtxuONwdaK7mNLMpzZOEcznk3FXvjPrguqpQdBWfiisEIVJ7PHLcbPFmW8xvGiadSJo9JSaTQiKqjyV+D+PZB2+VyhWk85fSbcuv/R3e7WvYSoGaBilQBEQ3LyMbaoBt5me7IAEBOhmle6+owX9aTPvvj5DBOUf6/Prl+2dvXi38P9/IS8Sg77ndP/4j1fUXvAoeTUPFkioAAAAASUVORK5CYII=",
        "CZ": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9gMDxIHL1QYFTUAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAACK0lEQVQ4y+2VPWtUQRSGn3Nmsh/ZRCQRxJ8gpLKzslSEIJL4CywEBREVsVALK5sgVkowIjaKYGGZhNhKAmqEKBq3UhNC3Gy8m4/d5O6dY3HvbkzlR1LmwDDDmTnvvDzMB+xFFjJy/15frljaF602bLc0oyiqcfL80NT0l3nbzSiXy1O6FK2F/iuPuDk8ys+VOgBmOzYf1DtHIdfBs/Fpjl14wNtP3xGRHfNQFXBOcKo0GjGnrj3m1vAoS9HaDoU1FXUqeKd0FfM8n3jP8UsPGZuc/W80qipIJq4qOKd4VeqNmHN3XnB7ZJxKtP7PG6iK4FVQFTQTV6eoCF3FHE/H3jFw/QkvJ8t/zV5LJXxLsOXITDAMVAjBUNeBLS+zcPEy5fkPJC3xELC0aFsTM+YOHcSrpHy3rUHAjNh7+pc+M7g4Q+/mOsmBXpxZisRAAIKlRswg6113N14EnNMsZ1jmvNBscnXuNUdr32giJN63HQlgIWT3LOOezRECOMX/qNaobm5Q6szTWciT5PKcqMwyuDhDz+YqTefTAgOj5da2eEtoC1uWF3H4+kZMtRZTjVYpJjFDX19xxFagVGKjUERzCiIgLXPpoM1XZBtfwUDBm0BTHAOVj5xdeMP+uMG6CNRqZNWI94gq4hyiAqIIkkHecosZJAl1DN8T1/XG7ASH6xUAEtV0/e9HywxLEixJ/vy0mWEhUbl75nSf97l9Ky63K8+mgKyFUNv7kdrxC84oYdkgu8rXAAAAAElFTkSuQmCC",
    };

	/* Create style document */
	let css = document.createElement('style');
	css.type = 'text/css';
	let styles = ".tamperhidden{display: none;} .tamperhidden.show{display:table;opacity:0.5} .tampernote{} .tamperflag{display: inline-block; width:22px; height:16px; object-fit:cover; vertical-align: middle; margin: 0 4px 0 0;} #tampertogglehide{position:absolute;top:120px;right:25px;width:100px;font-weight:bolder;}";
	if (css.styleSheet) {
		css.styleSheet.cssText = styles;
	} else {
		css.appendChild(document.createTextNode(styles));
	}
	/* Append style to the tag name */
	document.getElementsByTagName("head")[0].appendChild(css);

	let toggleHide = document.createElement('div')
	toggleHide.id = "tampertogglehide";
	toggleHide.innerHTML = '<a href="#">Toggle Hide</a>';
	document.getElementsByTagName("body")[0].appendChild(toggleHide);

	let toggler = document.querySelectorAll("#tampertogglehide a")[0];
	toggler.addEventListener("click", function () {
		let unhidden = document.querySelectorAll(".processed.tamperhidden.show");
		if (unhidden.length > 0) {
			for (let item of unhidden) {
				item.classList.remove('show');
			}
		}
		else {
			let hidden = document.querySelectorAll(".processed.tamperhidden");
			for (let item of hidden) {
				item.classList.add('show');
			}
		}
	});

    let rdpNamesList = document.querySelectorAll("#layerPanelTermSvcs #table_termsessionline_2 a b");
    for (let item of rdpNamesList) {
        let text = item.textContent;
            let parentContainer = item.closest("#table_termsessionline_1");
        if (ipsNamesToRemove.includes(text)) {
            console.log("---found item to remove: " + text);
            if (parentContainer.nextElementSibling) {
                //parentContainer.nextElementSibling.remove();
                //parentContainer.nextElementSibling.style = "display: none;";
				parentContainer.nextElementSibling.classList.add("processed");
				parentContainer.nextElementSibling.classList.add("tamperhidden");
            }
            //parentContainer.remove();
            //parentContainer.style = "display: none;"
			parentContainer.classList.add("processed");
			parentContainer.classList.add("tamperhidden");
        } else {
            if (Object.keys(notes).includes(text)) {
                console.log("---found item to add note: " + text + " -> " + notes[text]);
                item.parentElement.insertAdjacentHTML('afterend', ' <span class="tampernote">' + notes[text] + '</span>');

				parentContainer.classList.add("processed");
				parentContainer.classList.add("tampernote");
            }
            if (Object.keys(ipsToTranslate).includes(text)) {
                console.log("---found item to translate: " + text + " -> " + ipsToTranslate[text]);
                item.setAttribute("title", "Texto original: '" + text + "'");
                item.textContent = "*" + ipsToTranslate[text] + "*";
                text = ipsToTranslate[text];

				parentContainer.classList.add("processed");
				parentContainer.classList.add("tampertranslated");
            }
            let flag = "";
            switch (text.substring(0, 2)) {
                case "ES":
                    flag = countryFlags.ES;
                    break;
                case "FR":
                    flag = countryFlags.FR;
                    break;
                case "PL":
                    flag = countryFlags.PL;
                    break;
                case "PT":
                    flag = countryFlags.PT;
                    break;
                case "SK":
                    flag = countryFlags.SK;
                    break;
                default:
                    switch (text.substring(0, 3)) {
                        case "ACR":
                            flag = countryFlags.CZ;
                            break;
                        case "ARD":
                            flag = countryFlags.ES;
                            break;
                        case "LOI":
                            flag = countryFlags.FR;
                            break;
                        case "VAL":
                            flag = countryFlags.PT;
                            break;
                    }
                    break;
            }
            if (flag != "") {
                let img = '<img src="' + flag + '" alt="' + text.substring(0, 2) + '" class="tamperflag" />';
                item.parentElement.insertAdjacentHTML('beforebegin', img);
				parentContainer.classList.add("added-flag");
            }
            else {
                console.log("---did not found flag for item: " + text);
            }
        }
    }
})();
