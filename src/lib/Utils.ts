import enquire from 'enquire.js';

// Get is mobile by matchmedia (just for promise test)
export function isMobile(): Promise<boolean> {

    return new Promise(
        (resolve, reject) => {
            enquire.register('screen and (max-width: 769px)', {
                match: () => resolve(),
            });

            enquire.register('screen and (min-width: 770px)', {
                match: () => reject(),
            });
        },
    );
}
