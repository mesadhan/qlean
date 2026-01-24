let surahCache: { [key: string]: any } = {}

export const initCache = async (shuraId: string, translationEditor: string) => {


  // return translation from local file.txt
  const fs = require('fs');
  const path = require('path');

  const filePath = path.join(__dirname, `../shura/${shuraId}.txt`);
  console.log('debug-returnOfflineTranslation', filePath);
  
  let translations = [];

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');
    let counter = 0;
    for(let line of lines){
      // const [sId, aId, trans] = line.split('|');
      // console.log('debug-line', `line: ${shuraId}: ${line}`);
      if (line.startsWith(`${shuraId}:`)) {
        //console.log('debug-message', `line: ${line}`);
        translations.push({
          translationEditor: translationEditor,
          [shuraId +':'+ (counter+1)]: line
        });
        counter++;
      }
    }

  } catch (err) {
    console.error('Error reading offline translations:', err);
  }

  surahCache[shuraId] = translations;
  console.log('debug-offline-surahCache[shuraId]', shuraId, ' Total Ayah: ', surahCache[shuraId].length);
}


// Initialize custom translation cache for surahs 1 to 144
initCache('1', 'tazqianofs');
initCache('2', 'tazqianofs');
initCache('3', 'tazqianofs');
initCache('4', 'tazqianofs');
initCache('5', 'tazqianofs');
initCache('6', 'tazqianofs');
initCache('69', 'tazqianofs');
initCache('70', 'tazqianofs');
initCache('71', 'tazqianofs');
initCache('72', 'tazqianofs');
initCache('73', 'tazqianofs');
initCache('74', 'tazqianofs');
initCache('75', 'tazqianofs');
initCache('76', 'tazqianofs');
initCache('77', 'tazqianofs');
initCache('78', 'tazqianofs');
initCache('79', 'tazqianofs');
initCache('80', 'tazqianofs');
initCache('81', 'tazqianofs');
initCache('82', 'tazqianofs');
initCache('83', 'tazqianofs');
initCache('84', 'tazqianofs');
initCache('85', 'tazqianofs');
initCache('86', 'tazqianofs');
initCache('87', 'tazqianofs');
initCache('88', 'tazqianofs');
initCache('89', 'tazqianofs');
initCache('90', 'tazqianofs');
initCache('91', 'tazqianofs');
initCache('92', 'tazqianofs');
initCache('93', 'tazqianofs');
initCache('94', 'tazqianofs');
initCache('95', 'tazqianofs');
initCache('96', 'tazqianofs');  
initCache('97', 'tazqianofs'); 
initCache('98', 'tazqianofs'); 
initCache('99', 'tazqianofs'); 
initCache('100', 'tazqianofs');
initCache('101', 'tazqianofs');
initCache('102', 'tazqianofs');
initCache('103', 'tazqianofs');
initCache('104', 'tazqianofs');
initCache('105', 'tazqianofs');
initCache('106', 'tazqianofs'); 
initCache('107', 'tazqianofs');
initCache('108', 'tazqianofs');
initCache('109', 'tazqianofs');
initCache('110', 'tazqianofs');
initCache('111', 'tazqianofs');
initCache('112', 'tazqianofs');
initCache('113', 'tazqianofs');
initCache('114', 'tazqianofs');


export const returnOfflineTranslation = (shuraId: string, verseOrAyahNumber: string, translationEditor: string) => {
  let foundTranslation = shuraId+':'+ verseOrAyahNumber + '';
  try {
    const item = surahCache[shuraId]?.find((item: any) => item?.hasOwnProperty(foundTranslation));
    return item ? item[foundTranslation] : '';
  } catch (err) {
    return '';
  }
}