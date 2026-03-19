import {FontFamily, FontFamilyName, Label, PrintDensity, PrintDensityName, Spacing, Text} from "jszpl";

export default function getZpl(props){
    const labelZPL = new Label();

    labelZPL.printDensity = new PrintDensity(PrintDensityName['8dpmm']);
    labelZPL.width = 100;       //Label size is mm, others is in dots/... pxl(?
    labelZPL.height = 150;
    labelZPL.padding = new Spacing(10);

    const text = new Text();
    text.fontFamily = new FontFamily(FontFamilyName.D);
    text.text = props.text;

    labelZPL.content.push(text);

    const text2 = new Text();
    text2.text = "Soy un texto fijo\nY ahora estoy en otra linea"
    labelZPL.content.push(text2)

    return labelZPL.generateZPL();
}