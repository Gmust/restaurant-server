import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

import { Dish } from '../../schemas/dish.schema';

interface OrderDocument {
  email: string;
  dishes: Dish[];
  totalPrice: number;
}

export const generateOrderDocument = () => {
  const fonts = {
    Roboto: {
      normal: 'fonts/Roboto-Regular.ttf',
      bold: 'fonts/Roboto-Medium.ttf',
      italics: 'fonts/Roboto-Italic.ttf',
      bolditalics: 'fonts/Roboto-MediumItalic.ttf',
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
      { text: 'Your Order:', style: 'header' },
      '\n',
      { text: 'Test Order', style: 'subheader' },
      { text: 'Food' },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
      },
    },
  } as TDocumentDefinitions;
  const options = {};

  return printer.createPdfKitDocument(docDefinition, options);
};
