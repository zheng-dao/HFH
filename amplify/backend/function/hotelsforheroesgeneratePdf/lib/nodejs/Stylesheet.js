'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _renderer = require('@react-pdf/renderer');

/**
 * This file is duplicated in /amplify/backend/functions/emailApplicationFiles/src/Stylesheet.js
 * You must update both places!
 */
_renderer.Font.register({
  family: 'ProximaNova',
  fonts: [
    {
      src: 'https://resources.fisherhouse.org/v1.0.0/fonts/proximanova-regular-webfont.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://resources.fisherhouse.org/v1.0.0/fonts/proximanova-bold-webfont.otf',
      fontWeight: 'bold',
    },
  ],
});

const styles = _renderer.StyleSheet.create({
  page: {
    textAlign: 'center',
    paddingVertical: '0.15in',
    paddingHorizontal: '0.35in',
    color: '#333',
    fontSize: '13pt',
    flex: 1,
  },
  headerSection: {
    display: 'flex',
    alignItems: 'center',
  },
  header: {
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '20pt',
    fontFamily: 'ProximaNova',
    marginVertical: '8pt',
  },
  headerBreakLine: {
    height: '2px',
    width: '500px',
    backgroundColor: '#333',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: '14pt',
    fontFamily: 'ProximaNova',
    marginVertical: '8pt',
    textAlign: 'left',
  },
  subsectionTitle: {},
  confirmationNumber: {
    textAlign: 'center',
  },
  confirmationNumberNumber: {
    color: '#A80418',
  },
  pdfFields: {
    textAlign: 'left',
  },
  ul: {
    border: '2px solid #ccc',
    borderRadius: '8pt',
    paddingVertical: '4pt',
    paddingHorizontal: '12pt',
    margin: 0,
    marginBottom: '4pt',
    textAlign: 'left',
  },
  li: {
    borderBottom: '1pt solid #ccc',
    paddingVertical: '4pt',
    fontFamily: 'ProximaNova',
    fontSize: '10pt',
  },
  liLast: {
    borderBottom: 'none',
  },
  hotelInfoContainer: {
    display: 'flex',
    paddingTop: '10pt',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: '80pt',
  },
  hotelInfo: {
    alignItems: 'left',
    paddingVertical: '16pt',
    paddingHorizontal: '4pt',
    flexDirection: 'column',
    fontFamily: 'ProximaNova',
    fontSize: '10pt',
  },
  hotelLogo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: '16pt',
    width: '50%',
  },
  hotelDetails: {
    textAlign: 'left',
    width: '50%',
  },
  hotelDetailsParagraph: {
    paddingVertical: '0.25pt',
  },
  strong: {
    fontWeight: 'bold',
    fontFamily: 'ProximaNova',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
  },
  footerDescription: {
    fontSize: '10pt',
    fontWeight: 'bold',
    fontFamily: 'ProximaNova',
    padding: '32pt',
  },
  footerLogo: {
    width: 100,
    height: 100,
  },
  hotelInfos: {
    alignItems: 'left',
    marginTop: '-8px',
    flexDirection: 'column',
    fontFamily: 'ProximaNova',
  },
  footerLogos: {
    width: 80,
    height: 75,
  },
});

var _default = styles;
exports.default = _default;
