def print_progress(string):
    whitespace = ' ' * (30-len(string))
    print('\r{}: In progress{}'.format(string, whitespace), end='', flush=True)
    # sys.stdout.flush()
    # time.sleep(1)


def print_done(string):
    whitespace = ' ' * (30-len(string))
    print('\r{}: Done{}'.format(string, whitespace), flush=True)

