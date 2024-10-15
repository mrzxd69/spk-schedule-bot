import path from "path";
import { GetLinks } from "./class/GetLinks";
import { GetData } from "./class/GetData";

export class FileManager {
	private pathData = path.join(path.resolve(), "/data");
	private pathOutput = path.join(path.resolve(), "/output");
	private getLinks = new GetLinks(this.pathData, this.pathOutput);
	private getData: GetData;

	constructor(
		private search: string,
		private count: number,
	) {
		this.getData = new GetData(this.count);
	}

	public getLinksMain(search: string) {
		return this.getLinks.getLinks(search);
	}

	public getDataMain() {
		return this.getData.getData(this.search, this.getLinks);
	}

	public getLength() {
		return this.getLinks.getLinks(this.search).filesName.length;
	}
}
