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
initCache('7', 'tazqianofs');

export const returnOfflineTranslation = (shuraId: string, verseOrAyahNumber: string, translationEditor: string) => {
  let foundTranslation = shuraId+':'+ verseOrAyahNumber + '';
  return surahCache[shuraId]?.find((item: any) => item?.hasOwnProperty(foundTranslation))[foundTranslation];
}