import logging
import requests
from bs4 import BeautifulSoup
from apscore.exams.exams import Exams

# Set up logger
log = logging.getLogger(__name__)

URL = 'https://www.totalregistration.net/AP-Exam-Registration-Service/Compare-Score-Distributions.php'


def get_all_exam_results() -> dict:
    """Get results for all exams

    Scrape all exam pages on the totalregistration.net website for yearly scoring percentages

    :return: dictionary with data
    :rtype: dict
    """
    log.info('Getting exam results from totalregistration.net')

    data = {}
    for exam in Exams:
        data[exam] = get_exam_results(exam)
    return data


def format_row(row: list) -> list:
    """Format a row of scraped data into correct type

    All elements are scraped as strings and should be converted to the proper format to be used. This converts the
    following types:

    - Percentages become floats (Ex: '21.5%' --> 0.215)
    - Numbers become ints (Ex: '2020' --> 2020)
    - '-' becomes None
    - Booleans stay booleans
    - Strings stay strings

    :param row: list to be converted
    :return: list in converted form
    :rtype: list
    """
    new_row = []
    for i in row:
        if type(i) == bool:
            new_row.append(i)
            continue
        i = i.strip()
        if i == '-':
            new_row.append(None)
        elif i[-1] == '%':
            i = i[:-1]
            new_row.append(round(float(i) / 100, len(i)))
        else:
            try:
                new_row.append(int(i))
            except ValueError:
                new_row.append(i)
    log.debug(f'Formatted {row} into {new_row}')
    return new_row


def get_exam_results(exam: Exams) -> dict:
    """Get results for a specific exam.

    Scrape the totalregistration.net website for exam results for a given exam. The `exam_id` refers to the id used by
    Total Registration to categorize their exams.

    :param exam: id of the exam for which to get results
    :return: dictionary with results
    :rtype: dict
    """
    log.debug(f'Getting exam results for {exam.name}')

    log.debug(f'Attempting to reach exam page url: {URL}?id={exam.value}')
    page = requests.get(URL, {'id': exam.value})

    if page.status_code != 200:
        log.error(f'Unable to reach url: {URL}?id={exam.value}')
        raise RuntimeError(f'The requested URL could not be found: {URL}?id={exam.value}')
    log.debug(f'Successfully reached exam page')

    # Get table element
    soup = BeautifulSoup(page.content, 'html.parser')
    table = soup.find('table', id='scores1')
    log.debug('Found table element')

    # Get data
    data = {}
    tbody = table.find('tbody')
    log.debug('Found tbody element')
    for row in tbody.find_all('tr'):
        row_data = []
        major_revision = False
        for cell in row.find_all('td'):
            value = cell.find('span')
            major_revision = 'class' in value.attrs and 'text-orange' in value.attrs['class']
            row_data.append(value.getText())

        row_data = format_row(row_data + [major_revision])
        data[row_data[0]] = row_data
        log.debug(f'Added row: {row_data + [major_revision]}')

    log.debug(f'Returning exam results for {exam.name}')
    return data
