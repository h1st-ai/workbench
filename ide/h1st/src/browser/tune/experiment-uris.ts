import URI from '@theia/core/lib/common/uri';

export interface IDecodedTuningURI {
  id: string;
  name: string;
}

export namespace TuningUris {
  export const TUNING_SCHEME = 'tune';

  export const encode = (id: string, name: string): URI => {
    if (!id || !name) {
      throw new Error('id and name must be defined');
    }

    const data = {
      id,
      name,
    };

    return new URI()
      .withScheme(TUNING_SCHEME)
      .withPath(id)
      .withQuery(JSON.stringify(data));
  };

  export const decode = (uri: URI): IDecodedTuningURI => {
    const data: IDecodedTuningURI = JSON.parse(uri.query);

    return data;
  };
}
