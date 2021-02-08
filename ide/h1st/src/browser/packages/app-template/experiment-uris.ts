import { injectable, inject } from 'inversify';
import URI from '@theia/core/lib/common/uri';
import {
  DidChangeLabelEvent,
  LabelProvider,
  LabelProviderContribution,
} from '@theia/core/lib/browser';

export interface IDecodedTuningURI {
  id: string;
  name: string;
}

export namespace AppTemplateUris {
  export const TUNING_SCHEME = 'app-template';

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

  export const isTuningUri = (uri: URI): boolean => {
    if (uri.scheme === TUNING_SCHEME) {
      return true;
    }

    return false;
  };
}

@injectable()
export class AppTemplateUriLabelProvicerContribution
  implements LabelProviderContribution {
  constructor(@inject(LabelProvider) protected labelProvider: LabelProvider) {}

  canHandle(element: object): number {
    if (element instanceof URI && AppTemplateUris.isTuningUri(element)) {
      return 100;
    }
    return 0;
  }

  getLongName(uri: URI): string {
    return this.getName(uri);
  }

  getName(uri: URI): string {
    const { name } = AppTemplateUris.decode(uri);

    return name;
  }

  getIcon(uri: URI): string {
    return 'fa fa-sliders-h';
  }

  affects(diffUri: URI, event: DidChangeLabelEvent): boolean {
    console.log('did changed event', diffUri, event);
    return false;
  }
}
