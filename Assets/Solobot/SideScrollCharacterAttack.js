var punchSpeed = 1;
var punchHitTime = 0.2;
var punchTime = 0.4;
var punchPosition = new Vector3 (0, 0, 0.8);
var punchRadius = 1.3;
var punchHitPoints = 1;

var punchSound : AudioClip;

var bullet : Rigidbody;

private var busy = false; 

function Start ()
{
	animation["punch"].speed = punchSpeed;	
}

function Update ()
{
	var controller : SideScrollController = GetComponent(SideScrollController); 
	if(!busy && Input.GetButtonDown ("Fire1") && controller.IsGroundedWithTimeout() && !controller.IsMoving())
	{	
		SendMessage ("DidPunch");
		busy = true;
	}
	
	if (!busy && Input.GetButtonDown("Fire2") && controller.IsGroundedWithTimeout() && !controller.IsMoving())
	{
		SendMessage("DidShoot");
		busy = true;
	}
}

function DidPunch ()
{
	animation.CrossFadeQueued("punch", 0.1, QueueMode.PlayNow);
	yield WaitForSeconds(punchHitTime);
	var pos = transform.TransformPoint(punchPosition);
	var enemies : GameObject[] = GameObject.FindGameObjectsWithTag("Enemy");
	
	for (var go : GameObject in enemies)
	{
		var enemy = go.GetComponent(EnemyDamage);
		if (enemy == null)
			continue;
			
		if (Vector3.Distance(enemy.transform.position, pos) < punchRadius)
		{
			enemy.SendMessage("ApplyDamage", punchHitPoints);
			// Play sound.
			if (punchSound)
				audio.PlayOneShot(punchSound);
		}
	}
	yield WaitForSeconds(punchTime - punchHitTime);
	busy = false;
}

function DidShoot () {
	animation.CrossFadeQueued("punch", 0.1, QueueMode.PlayNow);
	yield WaitForSeconds(0.16);
	var bulletClone : Rigidbody = Instantiate(bullet, transform.position + new Vector3(0,1,0) + transform.forward, transform.rotation);
	bulletClone.velocity = transform.forward * 10.0;
	busy = false;
}

function OnDrawGizmosSelected ()
{
	Gizmos.color = Color.yellow;
	Gizmos.DrawWireSphere (transform.TransformPoint(punchPosition), punchRadius);
}

@script RequireComponent(AudioSource)