/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

// eslint-disable-next-line @typescript-eslint/prefer-interface
export type Ok<T> = {
  tag: 'ok';
  value: T;
};
// eslint-disable-next-line @typescript-eslint/prefer-interface
export type Err<E> = {
  tag: 'err';
  error: E;
};
export type Result<T, E> = Ok<T> | Err<E>;

export function asOk<T>(value: T): Ok<T> {
  return {
    tag: 'ok',
    value,
  };
}

export function asErr<T>(error: T): Err<T> {
  return {
    tag: 'err',
    error,
  };
}

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.tag === 'ok';
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return !isOk(result);
}

export function mapResult<T, E, R>(
  result: Result<T, E>,
  mapOk: (value: T) => R,
  mapErr: (err: E) => R
) {
  return isOk(result) ? mapOk(result.value) : mapErr(result.error);
}

export async function promiseResult<T, E>(future: Promise<T>): Promise<Result<T, E>> {
  try {
    return asOk(await future);
  } catch (e) {
    return asErr(e);
  }
}
