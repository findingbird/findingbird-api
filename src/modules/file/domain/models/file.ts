import { ValidationError } from '~/common/exceptions/ValidatioinError';
import { DomainEntity, DomainEntityProps } from '~/common/models/DomainEntity';
import { DateUtils } from '~/common/utils/Date.utils';

export interface FileNewProps {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
}

export interface FileProps extends FileNewProps, DomainEntityProps {}

export class File extends DomainEntity<FileProps> {
  public static domainName = 'File';

  private constructor(id: string, props: FileProps) {
    super(id, props);
  }

  public static create(id: string, props: FileProps): File {
    const file = new File(id, props);
    file.validateDomain();
    return file;
  }

  public static createNew(newProps: FileNewProps): File {
    const id = crypto.randomUUID();
    const now = DateUtils.now();
    return this.create(id, {
      ...newProps,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  private validateDomain(): void {
    if (!this.props.filename) {
      throw new ValidationError(File.domainName, 'Filename is required');
    }

    if (!this.props.originalName) {
      throw new ValidationError(File.domainName, 'OriginalName is required');
    }

    if (!this.props.mimeType) {
      throw new ValidationError(File.domainName, 'MimeType is required');
    }

    if (this.props.size === undefined || this.props.size <= 0) {
      throw new ValidationError(File.domainName, 'Size must be greater than 0');
    }

    if (!this.props.path) {
      throw new ValidationError(File.domainName, 'Path is required');
    }

    if (!this.props.url) {
      throw new ValidationError(File.domainName, 'URL is required');
    }
  }

  // Getters
  get filename(): string {
    return this.props.filename;
  }

  get originalName(): string {
    return this.props.originalName;
  }

  get mimeType(): string {
    return this.props.mimeType;
  }

  get size(): number {
    return this.props.size;
  }

  get path(): string {
    return this.props.path;
  }

  get url(): string {
    return this.props.url;
  }

  get isImage(): boolean {
    return this.props.mimeType.startsWith('image/');
  }

  // Methods
  // 삭제 시 파일원본이 지워져 복구 불가
  public delete(): void {
    this.changeProps({
      deletedAt: DateUtils.now(),
    });
  }
}
