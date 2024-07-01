import { DeepPartial, Repository } from "typeorm";

/**
 * Clase abstracta para la implementación de Seeders.
 * @template T - Entidad de TypeORM.
 */
export abstract class BaseSeederService<T> {
    /**
     * Obtiene el repositorio asociado a la entidad T.
     * @returns {Repository<T>} El repositorio de la entidad.
     */
    protected abstract get repository(): Repository<T>;

    /**
     * Obtiene los datos a cargar para la entidad T.
     * @returns {DeepPartial<T>[]} Arreglo de datos a sembrar.
     */
    protected abstract get data(): Promise<DeepPartial<T>[]>;

    /**
     * Realiza el sembrado de datos en la base de datos.
     * Este método evita la inserción de duplicados basándose en el id de la entidad.
     */
    async seed() {
        // Encuentra las entidades existentes en la base de datos.
        const existingEntities = await this.repository.find();

        // Crea un set con las identidades de las entidades existentes.
        const existingSet = new Set(
            existingEntities.map((entity) => this.getIdentity(entity)),
        );

        // Filtra los datos a insertar para incluir solo aquellos que no existen en la base de datos.
        const newEntities = (await this.data).filter(
            (entity) => !existingSet.has(this.getIdentity(entity)),
        );

        // Si hay nuevas entidades, las guarda en la base de datos.

        if (newEntities.length) {
            await this.repository.save(newEntities, {
                chunk: newEntities.length,
            });
        }
    }

    /**
     * Obtiene la identidad única de una entidad.
     * @param {DeepPartial<T>} entity - La entidad de la cual obtener el identificador.
     * @returns {any} La identidad de la entidad.
     * Ejemplo de implementación:
     * ```typescript
     * // Ejemplo:
     * protected getIdentity(entity: DeepPartial<Role>) {
     *     // Suponiendo que `role` es un campo único en la entidad `Role`, lo utilizamos como identificador.
     *     return entity.role;
     * }
     * ```
     * En este ejemplo, `entity.role` representa el identificador único de la entidad `Role`, que se utiliza para verificar si una instancia de `Role` ya existe en la base de datos antes de intentar insertarla.
     *
     */
    protected abstract getIdentity(entity: DeepPartial<T>): any;
}
