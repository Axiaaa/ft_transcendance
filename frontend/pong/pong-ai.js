var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// @ts-ignore
const tf = window.tf;
export class PongAI {
    constructor() {
        this.isLoaded = false;
        this.delay = 1000;
        this.lastUpdate = 0;
        this.actionArray = [];
        this.loadModel();
    }
    loadModel() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let modelPath = './model/model.json';
                this.model = yield tf.loadLayersModel(modelPath);
                this.isLoaded = true;
            }
            catch (error) {
                console.error("Error: The loading of the model went wrong: ", error);
                this.isLoaded = false;
            }
        });
    }
    calculateAction(state) {
        try {
            const paddleX = state[0];
            const paddleSpeed = state[2];
            const opponentX = state[3];
            const ballSpeedX = state[6];
            const ballSpeedY = state[7];
            let tensor = tf.tensor2d([state.slice(4)]);
            let output = this.model.predict(tensor);
            let predictionX = output.dataSync()[0];
            tensor.dispose();
            output.dispose();
            this.actionArray = [];
            if (ballSpeedY > 0)
                predictionX = 0;
            else if (Math.abs(ballSpeedX) < 0.02 && Math.abs(predictionX) < 1) {
                if (opponentX < predictionX)
                    predictionX -= 0.7;
                else
                    predictionX += 0.7;
            }
            let action = 2;
            if (predictionX > paddleX)
                action = 0;
            else if (predictionX < paddleX)
                action = 1;
            let distance = Math.abs(predictionX - paddleX) / paddleSpeed;
            for (let i = 0; i < distance; i++)
                this.actionArray.push(action);
        }
        catch (error) {
            console.error("Error: The model prediction went wrong:", error);
        }
    }
    getAction(ball, ballSpeed, paddle, paddleSpeed, opponent) {
        let currentTime = Date.now();
        if (currentTime - this.lastUpdate >= this.delay) {
            if (!this.isLoaded) {
                this.loadModel();
                return 2;
            }
            this.lastUpdate = currentTime;
            let state = [
                paddle.position.x,
                paddle.position.z,
                paddleSpeed,
                opponent,
                ball.position.x,
                ball.position.z,
                ballSpeed.x,
                ballSpeed.z,
            ];
            this.calculateAction(state);
        }
        let action = this.actionArray.pop();
        if (action != undefined)
            return action;
        return 2;
    }
}
