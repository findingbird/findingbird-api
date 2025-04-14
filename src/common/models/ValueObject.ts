export abstract class ValueObject<T> {
  protected _props: T;

  constructor(props: T) {
    this._props = Object.freeze(props);
  }

  get props(): T {
    return this._props;
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (this === vo) {
      return true;
    }
    if (this.constructor !== vo.constructor) {
      return false;
    }
    return JSON.stringify(this._props) === JSON.stringify(vo.props);
  }
}
