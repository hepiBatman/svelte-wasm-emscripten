const fsTester = () => {
  console.log('fsTester', !!fss);
  if (!fss) return;
  
  console.log('readFileSync', fss["readdir"]);
  fss["readdir"]('.', (err, files) => {
    files.map(file => {
      console.log('file', file);
    });
  });
};

let fss;
try {
  fss = require("fs");
  console.log('file system', fss);
  fsTester();
}
catch (e) {
  console.log(e);
}

export default fsTester;