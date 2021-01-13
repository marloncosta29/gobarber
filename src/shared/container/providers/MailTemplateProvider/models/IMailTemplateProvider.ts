import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
  parse({ template, variaveis }: IParseMailTemplateDTO): Promise<string>;
}
