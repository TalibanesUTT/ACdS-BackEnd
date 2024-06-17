import { DeepPartial, Repository } from "typeorm";

export abstract class BaseSeederService<T> {
    protected abstract get repository(): Repository<T>;

    protected abstract get data(): DeepPartial<T>[];

    async seed() {
        const existingEntities = await this.repository.find();
        const existingSet = new Set(
            existingEntities.map((entity) => this.getIdentity(entity)),
        );

        const newEntities = this.data.filter(
            (entity) => !existingSet.has(this.getIdentity(entity)),
        );

        if (newEntities.length) {
            await this.repository.save(newEntities, {
                chunk: newEntities.length,
            });
        }
    }

    protected abstract getIdentity(entity: DeepPartial<T>): any;
}
