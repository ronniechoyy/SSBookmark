import { useEffect, useState,useContext, createContext } from "react";
import wordBank from './translater.config.js';


// Save a translation in localStorage
function saveTranslation(originalText, translatedText, lang) {
  const translations = JSON.parse(localStorage.getItem('translations')) || {};
  translations[`${originalText}-${lang}`] = translatedText;
  localStorage.setItem('translations', JSON.stringify(translations));
}

// Get a translation from localStorage
function getTranslation(originalText, lang) {
  const translations = JSON.parse(localStorage.getItem('translations')) || {};
  return translations[`${originalText}-${lang}`];
}

// Modify translateApiCall to use getTranslation and saveTranslation
async function translateApiCall(text, lang) {
  // If the language is English, return the original text
  if (lang === 'en') {
    return text;
  }

  // Check if the translation is saved in localStorage
  const savedTranslation = getTranslation(text, lang);
  if (savedTranslation) {
    return savedTranslation;
  }

  // If the translation is not saved, make the API call
  const sourceLang = 'en';
  const targetLang = lang;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURI(text)}`;
  const response = await fetch(url);
  const data = await response.json();
  const text_out = data[0][0][0];

  // Save the translation in localStorage
  saveTranslation(text, text_out, lang);
  //console.log('text_out', text_out);
  return text_out;
}

const support_lang = {
  "zh-TW": null,
  "zh-CN": null,
  "en": null,
  "ja": null,
  "ko": null,
  "es": null,
  "fr": null,
  "de": null,
  "it": null,
  "pt": null,
  "ru": null,
  "ar": null,
  "hi": null
}

/**
 * Tran component for translating text.
 *
 * @param {Object} props - The props for the Tran component.
 * @param {support_lang} props.text - The text to translate. This should be an object that maps language codes to translations. The language codes can be any of the following: "zh-TW", "en", "ja", "es", "fr", "de", "it", "pt", "ru", "ar", "hi".
 * @param {string} props.lang - The current language. This should be one of the language codes listed above.
 * @example <Tran text={{ "en": "Follow", "zh-TW": "跟隨" }} lang={'en'} />
 */
function Tran({ text = support_lang/*, lang*/ }) {
  if (text.en == null||text.en == '') return (<></>)
  const lang = useContext(LangContext)
  let lang_inner = lang[0] == null ? 'en' : lang[0]
  //lang = lang == null ? 'en' : lang
  const trans_state = useState(text[lang_inner]??'');
  useEffect(() => {
    async function translate() {
      if (text[lang_inner]) {
        trans_state[1](text[lang_inner]);
      }else{
        const wordBankTranslation = wordBank[`${text['en']}-${lang_inner}`];
        if (wordBankTranslation) {
          trans_state[1](wordBankTranslation);
        } else
        {

          trans_state[1](await translateApiCall(text['en'], lang_inner));
        }
          

      }
      
    }
    translate();
  }, [text, lang[0]]);
  return (
    <>
      <span style={
        (lang[0] === 'zh-TW' || lang[0] === 'zh-CN' || lang[0] === 'ja') 
          ? { fontFamily: '"Noto Sans JP", sans-serif'} 
          : {}
      }>
        {trans_state[0]}
      </span>
    </>
  )
}

export function useTran( text = support_lang ) {
  if (text.en == null || text.en == '') return '';
  const lang = useContext(LangContext);
  let lang_inner = lang[0] == null ? 'en' : lang[0];
  const [transState, setTransState] = useState(text[lang_inner] ?? '');

  useEffect(() => {
    async function translate() {      
      if (text[lang_inner]) {
        setTransState(text[lang_inner]);
      } else {
        // Check if the translation is in the wordBank before making the API call
        const wordBankTranslation = wordBank[`${text['en']}-${lang_inner}`];
        // console.log('wordBankTranslation', wordBankTranslation);
        if (wordBankTranslation) {
          setTransState(wordBankTranslation);
        } else {
          setTransState(await translateApiCall(text['en'], lang_inner));
        }
      }
    }
    translate();
  }, [text, lang[0]]);

  return transState;
}

export const LangContext = createContext();

export default Tran;