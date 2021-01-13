interface ITemplateVariables {
  [x: string]: string | number;
}
export default interface IParseMailTemplateDTO {
  file: string;
  variaveis: ITemplateVariables;
}
