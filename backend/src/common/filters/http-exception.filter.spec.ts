import { ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { AllExceptionsFilter } from './http-exception.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let status: jest.Mock;
  let json: jest.Mock;
  let host: ArgumentsHost;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    host = {
      switchToHttp: () => ({
        getResponse: () => ({ status }),
      }),
    } as unknown as ArgumentsHost;
  });

  it('maps an HttpException with a string message', () => {
    filter.catch(new BadRequestException('Invalid input'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid input',
    });
  });

  it('joins an array of validation messages into a single string', () => {
    filter.catch(
      new BadRequestException(['name is required', 'email is invalid']),
      host,
    );

    expect(json).toHaveBeenCalledWith({
      success: false,
      message: 'name is required, email is invalid',
    });
  });

  it('maps a generic Error to a 500 with its message', () => {
    filter.catch(new Error('boom'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith({ success: false, message: 'boom' });
  });

  it('maps a non-Error, non-HttpException value to a generic 500 message', () => {
    filter.catch('unexpected string throw', host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error',
    });
  });
});
