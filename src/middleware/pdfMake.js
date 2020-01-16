import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import fs from 'fs-extra';
import path from 'path';
import { staticFolderPath, uploadPath } from '../routes/routes.json';

pdfMake.vfs = pdfFonts.pdfMake.vfs;


const createPDF = (docDefinition, filePath) => {
    return new Promise((resolve, reject) => {
      pdfMake.createPdf(docDefinition).getBase64(base64 => {
        fs.outputFile(filePath, base64, 'base64')
          .then(() => resolve(filePath))
          .catch(err => reject(err));
      });
    });
};


export const pdfPs4 = (data) =>{
    let table = [];
    let indexColumns = ['Nombre', 'Categoria', 'Estado','Instalado'];
    table.push(indexColumns);
    data.map( j => {
        let data = [];
        data.push(j.nombre);
        data.push(j.categoria);
        data.push(j.estado ? 'Terminado':'En juego');
        data.push(j.instalado? 'SI':'NO');
        table.push(data);
    });
    var docDefinition = {
        content: [
            {text: 'Reporte Juegos PS4', style: 'header'},
        
            {
                style: 'tableExample',
                table: {
                    body: table,
                    widths: [ 150, 100, 100, 100],
                }
            },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10],
                alignment:'center'
            },
            tableExample: {
                margin: [20, 20, 100, 100],
                alignment:'center'
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            }
        },
        defaultStyle: {
            alignment: 'justify'
        }
        
    }

    let filePath = path.join(staticFolderPath, uploadPath, '/temp', 'Reporte Juegos PS4.pdf');
    return createPDF(docDefinition, filePath);
}

export const pdfSwicth = (data) =>{
    let table = [];
    let indexColumns = ['Nombre', 'Categoria', 'Estado','Instalado'];
    table.push(indexColumns);
    data.map( j => {
        let data = [];
        data.push(j.nombre);
        data.push(j.categoria);
        data.push(j.estado ? 'Terminado':'En juego');
        data.push(j.instalado? 'SI':'NO');
        table.push(data);
    });
    var docDefinition = {
        content: [
            {text: 'Reporte Juegos SWITCH', style: 'header'},
        
            {
                style: 'tableExample',
                table: {
                    body: table,
                     widths: [ 150, 100, 100, 100],
                }
            },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10],
                alignment:'center'
            },
            tableExample: {
                margin: [20, 20, 100, 100],
                alignment:'center'
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            }
        },
        defaultStyle: {
            alignment: 'justify'
        }
        
    }

    let filePath = path.join(staticFolderPath, uploadPath, '/temp', 'Reporte Juegos SWITCH.pdf');
    return createPDF(docDefinition, filePath);
}