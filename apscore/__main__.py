import argparse
import logging
import os

from apscore import app


def main():
    parser = argparse.ArgumentParser(prog='apscore')

    # Fetch new data
    parser.add_argument('-u', '--update', action='store_true', help='update results from totalregistration.net')

    # Verbose/quiet arguments
    output_group = parser.add_mutually_exclusive_group()
    output_group.add_argument('-v', '--verbose', action='store_true')
    output_group.add_argument('-q', '--quiet', action='store_true')

    args = parser.parse_args()

    # Set up logging
    if args.verbose:
        logging.basicConfig(format='%(message)s', level=logging.DEBUG)
    elif args.quiet:
        logging.basicConfig(format='%(message)s', level=logging.WARNING)
    else:
        logging.basicConfig(format='%(message)s', level=logging.INFO)

    # Run application
    app.run(update=args.update)


if __name__ == '__main__':
    main()
